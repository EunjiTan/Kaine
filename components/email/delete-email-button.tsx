'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteEmailButtonProps {
  emailId: string;
}

export function DeleteEmailButton({ emailId }: DeleteEmailButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this email?')) return;

    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', emailId);

      if (error) throw error;
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="ghost"
      size="icon"
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
