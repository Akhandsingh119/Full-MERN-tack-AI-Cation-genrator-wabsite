import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import TopNavbar from '../components/TopNavbar';
import Button from '../components/Button';
import api from '../api/axios';

export default function DashboardPage() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [genTime, setGenTime] = useState(null);
  const [activeVariant, setActiveVariant] = useState('medium');
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null); setError(null); setGenTime(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setFile(null); setPreviewUrl(null); setResult(null); setError(null); setGenTime(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setError(null); setResult(null); setGenTime(null);
    const startTime = performance.now();
    try {
      const formData = new FormData();
      formData.append('images', file);
      const response = await api.post('/post', formData);
      setGenTime(((performance.now() - startTime) / 1000).toFixed(1));
      setResult(response.data);
      const caption = response.data.variants?.medium || response.data.caption || '';
      addNotification('created', 'Caption Generated Successfully', previewUrl, caption);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate caption. Please try again.');
    } finally { setUploading(false); }
  };

  const currentCaption = result?.variants?.[activeVariant] || result?.caption || '';
  const wordCount = currentCaption.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = async () => {
    if (!currentCaption) return;
    try { await navigator.clipboard.writeText(currentCaption); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const handleCopyHashtags = async () => {
    if (!result?.hashtags?.length) return;
    try {
      await navigator.clipboard.writeText(result.hashtags.join(' '));
      setCopiedHashtags(true);
      setTimeout(() => setCopiedHashtags(false), 2000);
    } catch {}
  };

  const truncateName = (name, maxLen = 28) => {
    if (name.length <= maxLen) return name;
    const ext = name.lastIndexOf('.');
    const base = name.slice(0, ext === -1 ? maxLen - 3 : ext);
    const extension = ext === -1 ? '' : name.slice(ext);
    const keep = maxLen - 3 - extension.length;
    return base.slice(0, keep > 0 ? keep : 0) + '...' + extension;
  };

  return (
    <div className="crosshatch-bg min-h-screen">
      <TopNavbar />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 border-2 border-gold/40 flex items-center justify-center text-sm font-display font-bold text-gold">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-display text-champagne uppercase tracking-widest">New Caption</h1>
              <p className="text-xs font-body uppercase tracking-widest text-pewter mt-0.5">
                Welcome back, <span className="text-gold font-semibold">{user?.username || 'User'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-charcoal border border-gold/30">
            <div className="px-6 py-4 border-b border-gold/20">
              <h2 className="text-sm font-display text-champagne uppercase tracking-widest">Generate Caption</h2>
              <p className="text-xs font-body text-pewter mt-0.5 uppercase tracking-widest">Upload an image and AI will create a caption</p>
            </div>

            <div className="p-6">
              <div
                className={`border-2 border-dashed transition-all duration-300 ${
                  dragActive ? 'border-gold bg-gold/5' : previewUrl ? 'border-gold/30 bg-charcoal/50' : 'border-gold/20 hover:border-gold/40'
                }`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" id="image-upload" />

                {previewUrl ? (
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="flex-shrink-0">
                        <img src={previewUrl} alt="Preview" className="max-h-44 w-auto border border-gold/20" />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <p className="text-xs font-body uppercase tracking-widest text-champagne truncate" title={file.name}>{truncateName(file.name)}</p>
                        <p className="text-xs font-body text-gold/40 mt-1 tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button onClick={removeFile} className="mt-2.5 text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-red-400 underline underline-offset-2 transition-colors duration-300">Remove</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer block py-14 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 border-2 border-gold/30 flex items-center justify-center text-gold/60">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs font-body font-semibold uppercase tracking-widest text-champagne mb-1">
                      Drop an image here, or <span className="text-gold">browse</span>
                    </p>
                    <p className="text-xs font-body text-pewter">PNG, JPG, GIF up to 10MB</p>
                  </label>
                )}
              </div>

              {file && (
                <div className="mt-5">
                  <Button onClick={handleUpload} disabled={uploading} loading={uploading} variant="solid" size="lg" className="w-full">
                    {uploading ? 'Generating...' : 'Generate Caption'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {uploading && (
          <div className="mt-6 animate-fade-up">
            <div className="bg-charcoal border border-gold/30 p-10 text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-2 border-gold/30 border-t-gold animate-spin" />
              <p className="text-sm font-display text-champagne uppercase tracking-widest mb-1">Analyzing Your Image</p>
              <p className="text-xs font-body text-pewter uppercase tracking-widest">AI is crafting the perfect caption...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 animate-fade-up">
            <div className="bg-charcoal border border-red-500/30 p-4 flex items-start gap-3">
              <div className="w-7 h-7 border border-red-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-body text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !uploading && (
          <div className="mt-6 animate-fade-up">
            <div className="bg-charcoal border border-gold/30">
              {/* Success Badge */}
              <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-gold/20 bg-gold/[0.03]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 border border-gold/40 bg-gold/[0.08]">
                  <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-xs font-body font-semibold uppercase tracking-widest text-gold">Caption Generated Successfully</span>
                </div>
              </div>

              {/* Content: Image + Caption side by side */}
              <div className="grid sm:grid-cols-2 gap-0">
                <div className="p-0 sm:p-0 flex items-stretch border-b sm:border-b-0 sm:border-r border-gold/20 bg-obsidian/30">
                  {previewUrl && (
                    <img src={previewUrl} alt="Uploaded" className="h-full w-full object-cover border-0" />
                  )}
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-start h-[360px]">
                  {/* Variant Tabs */}
                  {result?.variants && (
                    <div className="flex border-b border-gold/20 mb-4 flex-shrink-0">
                      {['short', 'medium', 'long'].map((key) => (
                        <button
                          key={key}
                          onClick={() => { setActiveVariant(key); setCopied(false); }}
                          className={`px-4 py-2 text-xs font-body font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 -mb-[1px] ${
                            activeVariant === key
                              ? 'border-gold text-gold'
                              : 'border-transparent text-pewter hover:text-champagne'
                          }`}
                        >
                          {key === 'short' ? 'Short' : key === 'medium' ? 'Medium' : 'Long'}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex-1 min-h-0 overflow-y-auto mb-4">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeVariant}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-base sm:text-lg font-body font-light text-champagne leading-relaxed"
                      >
                        {currentCaption}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-4" />

                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-gold text-xs font-body font-semibold uppercase tracking-widest text-gold hover:bg-gold hover:text-obsidian hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
                    >
                      {copied ? 'Copied' : 'Copy Caption'}
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-gold/20 text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-champagne hover:border-gold/40 transition-all duration-300 disabled:opacity-30"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                      Regenerate
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-body text-pewter uppercase tracking-widest">
                    <span>{wordCount} words</span>
                    {genTime && <><span className="text-gold/40">•</span><span>Generated in {genTime}s</span></>}
                  </div>

                  {/* Hashtags */}
                  {result?.hashtags?.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gold/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-gold">Hashtags</h4>
                        <button
                          onClick={handleCopyHashtags}
                          className="text-xs font-body font-semibold uppercase tracking-widest text-pewter hover:text-gold transition-colors duration-300"
                        >
                          {copiedHashtags ? 'Copied!' : 'Copy All'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block px-2.5 py-1 border border-gold/20 text-xs font-body text-gold/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
