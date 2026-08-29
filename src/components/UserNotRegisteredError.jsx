import React from 'react';
import { Link } from 'react-router-dom';
import { UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserNotRegisteredError() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background px-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <UserX className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-xl font-medium">Account not found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn't find an ANGELORA account for this session. Please log in again or create a new account.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
