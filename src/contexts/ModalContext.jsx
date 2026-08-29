import React, { createContext, useCallback, useContext, useState } from "react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const open = useCallback((modal) => {
    setModals((m) => [...m, { id: Date.now() + Math.random(), ...modal }]);
  }, []);

  const close = useCallback((id) => {
    setModals((m) => m.filter((x) => x.id !== id));
  }, []);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        const id = Date.now() + Math.random();
        const close_ = (val) => {
          close(id);
          resolve(val);
        };
        open({
          id,
          type: "confirm",
          title: opts.title,
          message: opts.message,
          confirmLabel: opts.confirmLabel || "Confirm",
          cancelLabel: opts.cancelLabel || "Cancel",
          danger: opts.danger,
          onConfirm: () => close_(true),
          onCancel: () => close_(false),
        });
      }),
    [open, close]
  );

  const openCustom = useCallback((content) => {
    const id = Date.now() + Math.random();
    open({ id, type: "custom", content, onClose: () => close(id) });
    return () => close(id);
  }, [open, close]);

  return (
    <ModalContext.Provider value={{ open, close, confirm, openCustom }}>
      {children}
      <div className="aetheris-modals">
        {modals.map((m) => (
          <ModalRenderer key={m.id} modal={m} onClose={() => close(m.id)} />
        ))}
      </div>
    </ModalContext.Provider>
  );
};

function ModalRenderer({ modal, onClose }) {
  if (modal.type === "custom") {
    return (
      <Dialog open onOpenChange={(o) => !o && (modal.onClose ? modal.onClose() : onClose())}>
        <DialogPortal>
          <DialogOverlay className="bg-foreground/40 backdrop-blur-[6px]" />
          <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border bg-background">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-6 pb-6 -mt-8">{modal.content}</div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  // confirm
  return (
    <Dialog open onOpenChange={(o) => !o && (modal.onCancel ? modal.onCancel() : onClose())}>
      <DialogPortal>
        <DialogOverlay className="bg-foreground/40 backdrop-blur-[6px]" />
        <DialogContent className="sm:max-w-md p-6 border-border bg-background">
          <h2 className="font-heading text-lg font-medium tracking-tight">{modal.title}</h2>
          {modal.message && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{modal.message}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={modal.onCancel || onClose}>
              {modal.cancelLabel}
            </Button>
            <Button
              variant={modal.danger ? "destructive" : "default"}
              onClick={modal.onConfirm || onClose}
            >
              {modal.confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};