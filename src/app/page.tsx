"use client";
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'C', value: 'c' },
  { label: 'Java', value: 'java' },
  { label: 'Rust', value: 'rust' },
];

export default function CodeRunner() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/run', { code, language });
      const data = res.data;
      setOutput(
        data.stdout || data.compile_output || data.stderr || data.message || JSON.stringify(data.status)
      );
    } catch (err: any) {
      setOutput('Error running code: ' + err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono px-4 py-6">
      <motion.div
        className="max-w-5xl mx-auto shadow-2xl rounded-2xl p-6 bg-slate-800/50 backdrop-blur border border-slate-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-blue-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Gluto
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <label className="text-lg font-semibold mb-2 md:mb-0">Choose Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded bg-slate-900 text-white p-2 border border-slate-600 focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={15}
          spellCheck={false}
          placeholder='// Write your code here'
          className="w-full p-4 text-sm bg-slate-900 text-white rounded-xl border border-slate-600 focus:outline-none"
        />

        <button
          onClick={runCode}
          disabled={isLoading}
          className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition duration-200"
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>

        <motion.div
          className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-600 overflow-auto text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-lg mb-2">Output:</h2>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </motion.div>
      </motion.div>
    </div>
  );
}
