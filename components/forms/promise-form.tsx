'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PromiseForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const data = {
      promiserName: formData.get('promiserName'),
      description: formData.get('description'),
      party: formData.get('party'),
      articleLink: formData.get('articleLink'),
      promisedDate: formData.get('promisedDate'),
      screenshot: formData.get('screenshot')
    };

    try {
      const response = await fetch('/api/promises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit promise');
      }

      const result = await response.json();
      console.log('Success:', result);
      event.currentTarget.reset();
      alert('Promise submitted successfully!');

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit promise. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="promiserName" className="block text-sm font-medium text-gray-700">
          Promiser Name
        </label>
        <Input
          id="promiserName"
          name="promiserName"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="party" className="block text-sm font-medium text-gray-700">
          Party
        </label>
        <Select name="party" required>
          <SelectTrigger>
            <SelectValue placeholder="Select party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPN_UML">Communist Party of Nepal (UML)</SelectItem>
            <SelectItem value="NEPALI_CONGRESS">Nepali Congress</SelectItem>
            <SelectItem value="CPN_MAOIST">Communist Party of Nepal (Maoist Centre)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="articleLink" className="block text-sm font-medium text-gray-700">
          Article Link
        </label>
        <Input
          id="articleLink"
          name="articleLink"
          type="url"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="promisedDate" className="block text-sm font-medium text-gray-700">
          Promised Date
        </label>
        <Input
          id="promisedDate"
          name="promisedDate"
          type="date"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">
          Screenshot URL (optional)
        </label>
        <Input
          id="screenshot"
          name="screenshot"
          type="url"
          className="mt-1"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Promise'}
      </Button>
    </form>
  );
}
