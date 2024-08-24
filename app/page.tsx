'use client';

import { useState } from 'react';
import { pdfToBase64, base64ToPdf, viewPdf } from '@/utils/converter';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


export default function Home() {
  const [base64, setBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('document.pdf');
  const [inputType, setInputType] = useState<'file' | 'base64'>('file');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name); // Set file name when uploading, but don't display it
      const base64String = await pdfToBase64(file);
      setBase64(base64String); // Display the base64 string
      setCopied(false); // Reset copied state
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(base64).then(() => {
      setCopied(true);
    });
  };

  const handleConvertBase64ToPdf = () => {
    viewPdf(base64); // Display the PDF in a new window/tab
  };

  return (
    <>
      <Head>
        <title>Base64 to PDF Converter</title>
        <meta name="description" content="Convert base64 strings to PDF and vice versa with our easy-to-use online tool." />
        <meta name="keywords" content="base64 to pdf, pdf to base64, online converter, download pdf, view pdf" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta property="og:title" content="Base64 to PDF Converter" />
        <meta property="og:description" content="Convert base64 strings to PDF and vice versa with our easy-to-use online tool." />
        <meta property="og:url" content="https://pdf-app-livid.vercel.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-4 max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Base64 to PDF Converter</h1>
        <div className="flex flex-col items-center space-y-6">

          {/* Radio Buttons for Input Type Selection */}
          <RadioGroup 
            value={inputType} 
            onValueChange={(value: 'file' | 'base64') => setInputType(value)}
            className="flex justify-center mb-4"
          >
            <RadioGroupItem value="file" id="file" />
            <label htmlFor="file" className="ml-2 mr-6">Upload PDF File</label>
            <RadioGroupItem value="base64" id="base64" />
            <label htmlFor="base64" className="ml-2">Paste Base64 String</label>
          </RadioGroup>

          {/* File Upload Input */}
          {inputType === 'file' && (
            <>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="mb-4"
              />
              <Textarea
                value={base64}
                placeholder="Base64 string will appear here"
                className="w-full"
                rows={6}
                readOnly
              />
              {base64 && (
                <Button onClick={handleCopyToClipboard} className="w-full">
                  {copied ? 'Copied!' : 'Copy Base64 String'}
                </Button>
              )}
            </>
          )}

          {/* Base64 Text Area Input */}
          {inputType === 'base64' && (
            <>
              <Textarea
                value={base64}
                onChange={(e) => setBase64(e.target.value)}
                placeholder="Paste base64 string here"
                className="w-full"
                rows={6}
              />
              <Button onClick={handleConvertBase64ToPdf} className="w-full bg-green-500">
                Convert to PDF and View
              </Button>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 w-full">
            {inputType === 'file' && base64 && (
              <Button onClick={() => base64ToPdf(base64, fileName)} className="w-full bg-blue-500">
                Download PDF
              </Button>
            )}
            {inputType === 'base64' && (
              <Button onClick={() => viewPdf(base64)} className="w-full bg-green-500">
                View PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}