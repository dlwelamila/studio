'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function RuntimeDateViewer() {
  const [dateString, setDateString] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only in the browser, after the component has mounted.
    setDateString(new Date().toString());
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Runtime Date Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Result of `new Date().toString()` executed in the browser:
        </p>
        {dateString ? (
          <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-code">
            <code>{dateString}</code>
          </pre>
        ) : (
          <p className="mt-2 font-semibold">Loading date from runtime...</p>
        )}
      </CardContent>
    </Card>
  );
}
