'use client';

import { useState } from 'react';
import { pdfToBase64, base64ToPdf, viewPdf } from '@/utils/converter';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';

export default function Home() {
  const [base64, setBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('document.pdf');
  const [inputType, setInputType] = useState<'file' | 'base64'>('file');
  const [copied, setCopied] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

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
        <title>Base64 to PDF Converter - Convert and View PDFs</title>
        <meta
          name="description"
          content="Convert your PDF files to Base64 format and view them instantly. This tool also allows you to convert Base64 strings back to PDF."
        />
      </Head>

      <div className="container mx-auto p-6 max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Base64 to PDF Converter</h1>
          <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-2">
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Convert your PDF files to Base64 strings or convert Base64 strings back to PDFs. This tool provides a seamless way to handle your PDF conversion needs.
          Make sure to upload a valid PDF file or paste a correct Base64 string to proceed.
        </p>

        <div className="flex flex-col items-center space-y-8">
          <RadioGroup 
            value={inputType} 
            onValueChange={(value: 'file' | 'base64') => setInputType(value)}
            className="flex justify-center space-x-8"
          >
            <div className="flex items-center">
              <RadioGroupItem value="file" id="file" className="hidden" />
              <label htmlFor="file" className={`cursor-pointer px-4 py-2 rounded-lg text-lg font-semibold transition ${
                inputType === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-700'
              }`}>
                Upload PDF File
              </label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="base64" id="base64" className="hidden" />
              <label htmlFor="base64" className={`cursor-pointer px-4 py-2 rounded-lg text-lg font-semibold transition ${
                inputType === 'base64' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 text-gray-700'
              }`}>
                Paste Base64 String
              </label>
            </div>
          </RadioGroup>

          {inputType === 'file' && (
            <>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="mb-4 border-2 border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full"
              />
              <Textarea
                value={base64}
                placeholder="Base64 string will appear here"
                className="w-full border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                rows={6}
                readOnly
              />
              {base64 && (
                <Button onClick={handleCopyToClipboard} className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-3 transition">
                  {copied ? 'Copied!' : 'Copy Base64 String'}
                </Button>
              )}
            </>
          )}

          {inputType === 'base64' && (
            <>
              <Textarea
                value={base64}
                onChange={(e) => setBase64(e.target.value)}
                placeholder="Paste base64 string here"
                className="w-full border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                rows={6}
              />
              <Button onClick={handleConvertBase64ToPdf} className="w-full mt-4 bg-green-600 text-white hover:bg-green-700 rounded-lg py-3 transition">
                Convert to PDF and View
              </Button>
            </>
          )}

          <div className="flex space-x-4 w-full mt-6">
            {inputType === 'file' && base64 && (
              <Button onClick={() => base64ToPdf(base64, fileName)} className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-3 transition">
                Download PDF
              </Button>
            )}
            {inputType === 'base64' && (
              <Button onClick={() => viewPdf(base64)} className="w-full bg-green-600 text-white hover:bg-green-700 rounded-lg py-3 transition">
                View PDF
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
