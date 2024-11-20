'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PoliticalParty } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PARTY_LABELS = {
  CPN_UML: "CPN-UML (Communist Party of Nepal UML)",
  NC: "Nepali Congress",
  MAOIST: "Communist Party of Nepal (Maoist Centre)",
  JSP: "Janata Samajwadi Party",
  LSP: "Loktantrik Samajwadi Party",
  RPP: "Rastriya Prajatantra Party",
  PEOPLES_FRONT: "Rastriya Janamorcha",
  WORKERS_PEASANTS: "Nepal Workers and Peasants Party",
  OTHER: "Other"
};

export function PromiseForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/api/auth/signin?callbackUrl=/submit');
    return null;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    
    // Handle screenshot upload first if exists
    let screenshotUrl = '';
    if (screenshot) {
      const imageFormData = new FormData();
      imageFormData.append('file', screenshot);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload screenshot');
        const { url } = await uploadRes.json();
        screenshotUrl = url;
      } catch (error) {
        console.error('Screenshot upload error:', error);
        setError('Failed to upload screenshot');
        setIsSubmitting(false);
        return;
      }
    }

    const data = {
      promiserName: formData.get('promiserName'),
      description: formData.get('description'),
      party: formData.get('party'),
      articleLink: formData.get('articleLink'),
      promisedDate: formData.get('promisedDate'),
      screenshot: screenshotUrl,
    };

    try {
      const response = await fetch('/api/promises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to submit promise';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          console.error('Response text:', responseText);
        }
        throw new Error(errorMessage);
      }

      router.push('/promises');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit promise');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="promiserName">Politician Name</Label>
        <Input
          id="promiserName"
          name="promiserName"
          required
          placeholder="Enter the name of the politician"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Promise Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe the promise made"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="party">Political Party</Label>
        <Select name="party" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a party" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PARTY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="articleLink">Article Link</Label>
        <Input
          id="articleLink"
          name="articleLink"
          type="url"
          required
          placeholder="https://example.com/article"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="screenshot">Screenshot (Optional)</Label>
        <Input
          id="screenshot"
          name="screenshot"
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promisedDate">Date of Promise</Label>
        <Input
          id="promisedDate"
          name="promisedDate"
          type="date"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Promise'}
      </Button>
    </form>
  );
}
