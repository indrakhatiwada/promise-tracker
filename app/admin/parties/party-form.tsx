'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Party } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';

interface PartyFormProps {
  party?: Party;
  isEditing?: boolean;
}

export function PartyForm({ party, isEditing }: PartyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [symbolPreview, setSymbolPreview] = useState(party?.symbol);

  async function handleSymbolUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload symbol');

      const { url } = await response.json();
      setSymbolPreview(url);
      return url;
    } catch (error) {
      console.error('Symbol upload error:', error);
      throw error;
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      let symbolUrl = symbolPreview;

      // Handle symbol upload if a new file is selected
      const symbolFile = formData.get('symbol') as File;
      if (symbolFile.size > 0) {
        symbolUrl = await handleSymbolUpload(symbolFile);
      }

      const data = {
        nameEn: formData.get('nameEn'),
        nameNp: formData.get('nameNp'),
        shortName: formData.get('shortName'),
        descriptionEn: formData.get('descriptionEn'),
        descriptionNp: formData.get('descriptionNp'),
        symbol: symbolUrl,
      };

      const response = await fetch(
        isEditing ? `/api/parties/${party?.id}` : '/api/parties',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save party');
      }

      router.push('/admin/parties');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save party');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nameEn">English Name</Label>
          <Input
            id="nameEn"
            name="nameEn"
            defaultValue={party?.nameEn}
            required
            placeholder="Communist Party of Nepal (UML)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nameNp">Nepali Name</Label>
          <Input
            id="nameNp"
            name="nameNp"
            defaultValue={party?.nameNp}
            required
            placeholder="नेपाल कम्युनिष्ट पार्टी (एमाले)"
            className="font-nepali"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortName">Short Name</Label>
          <Input
            id="shortName"
            name="shortName"
            defaultValue={party?.shortName}
            required
            placeholder="CPN-UML"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="symbol">Party Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setSymbolPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {symbolPreview && (
            <div className="mt-2 relative h-20 w-20">
              <Image
                src={symbolPreview}
                alt="Party symbol preview"
                fill
                className="object-contain rounded-sm"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionEn">English Description</Label>
          <Textarea
            id="descriptionEn"
            name="descriptionEn"
            defaultValue={party?.descriptionEn || ''}
            placeholder="Brief description of the party in English"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionNp">Nepali Description</Label>
          <Textarea
            id="descriptionNp"
            name="descriptionNp"
            defaultValue={party?.descriptionNp || ''}
            placeholder="पार्टीको छोटो विवरण नेपालीमा"
            className="min-h-[100px] font-nepali"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/parties')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Party' : 'Add Party'}
        </Button>
      </div>
    </form>
  );
}
