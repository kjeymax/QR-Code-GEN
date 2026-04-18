import React, { useState, useMemo } from 'react';
import { useBarcodeStore } from '../../stores/barcodeStore';
import { BARCODE_FORMATS, autoDetectFormat, aiSmartParse } from '../../utils/barcodeEngine';
import { INPUT_MODES, buildVCard, buildWiFi, buildEmail, buildSMS, buildPhone } from '../../utils/smartInput';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, Globe, User, Wifi, Mail, MessageSquare, Phone,
  Sparkles, ArrowRight, Lightbulb, Wand2
} from 'lucide-react';

const ICONS = {
  Type, Globe, User, Wifi, Mail, MessageSquare, Phone,
};

function SmartFieldInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="label-text">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field text-sm"
      />
    </div>
  );
}

export default function InputPanel() {
  const {
    inputData, setInputData,
    barcodeFormat, setBarcodeFormat,
    inputMode, setInputMode,
    smartFields, setSmartField,
  } = useBarcodeStore();

  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [showAI, setShowAI] = useState(false);

  // Smart input mode icons
  const modeList = Object.values(INPUT_MODES);

  // Auto-detect format suggestion
  const suggestedFormat = useMemo(() => {
    if (!inputData || inputMode !== 'text') return null;
    const detected = autoDetectFormat(inputData);
    if (detected !== barcodeFormat) {
      return BARCODE_FORMATS[detected];
    }
    return null;
  }, [inputData, barcodeFormat, inputMode]);

  // Build data from smart fields
  const buildSmartData = () => {
    switch (inputMode) {
      case 'url':
        return smartFields.url || '';
      case 'vcard':
        return buildVCard(smartFields);
      case 'wifi':
        return buildWiFi(smartFields);
      case 'email':
        return buildEmail({
          to: smartFields.emailTo,
          subject: smartFields.emailSubject,
          body: smartFields.emailBody,
        });
      case 'sms':
        return buildSMS({
          phone: smartFields.smsPhone,
          message: smartFields.smsMessage,
        });
      case 'phone':
        return buildPhone({ phone: smartFields.phoneNumber });
      default:
        return inputData;
    }
  };

  // Apply smart data to input
  const applySmartData = () => {
    const data = buildSmartData();
    if (data) {
      setInputData(data);
      // Auto-switch to QR for structured data
      if (inputMode !== 'text') {
        setBarcodeFormat('qrcode');
      }
    }
  };

  // Handle AI Smart Generate
  const handleAIGenerate = () => {
    if (!aiInput.trim()) return;
    const result = aiSmartParse(aiInput);
    setAiResult(result);
  };

  const applyAIResult = () => {
    if (aiResult) {
      setInputData(aiResult.data);
      setBarcodeFormat(aiResult.format);
      setAiResult(null);
      setShowAI(false);
      setAiInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Smart Generator Toggle */}
      <button
        onClick={() => setShowAI(!showAI)}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          showAI
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
            : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 hover:from-purple-500/20 hover:to-pink-500/20'
        }`}
      >
        <Wand2 size={16} />
        AI Smart Generator
        <Sparkles size={14} />
      </button>

      {/* AI Panel */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 space-y-3 border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <Lightbulb size={14} />
                <span>Describe what you need in plain English</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                  placeholder='e.g., "Create a barcode for product ID 12345"'
                  className="input-field text-sm flex-1"
                />
                <button onClick={handleAIGenerate} className="btn-primary px-4 text-sm">
                  <Sparkles size={14} />
                </button>
              </div>

              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      AI Suggestion
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300">
                      {aiResult.confidence}% confident
                    </span>
                  </div>
                  <p className="text-sm text-dark-700 dark:text-dark-200 mb-1">
                    <strong>Format:</strong> {BARCODE_FORMATS[aiResult.format]?.name}
                  </p>
                  <p className="text-sm text-dark-700 dark:text-dark-200 mb-3">
                    <strong>Data:</strong> {aiResult.data}
                  </p>
                  <button onClick={applyAIResult} className="btn-primary text-sm w-full">
                    Apply Suggestion <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Mode Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-dark-800 rounded-xl">
        {modeList.map((mode) => {
          const Icon = ICONS[mode.icon] || Type;
          return (
            <button
              key={mode.id}
              onClick={() => setInputMode(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                inputMode === mode.id
                  ? 'bg-white dark:bg-dark-700 text-dark-800 dark:text-white shadow-sm'
                  : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
              }`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{mode.name}</span>
            </button>
          );
        })}
      </div>

      {/* Plain Text Input */}
      {inputMode === 'text' && (
        <div>
          <label className="label-text">Data / Text</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={BARCODE_FORMATS[barcodeFormat]?.placeholder || 'Enter data...'}
            rows={3}
            className="input-field text-sm resize-none"
          />
        </div>
      )}

      {/* URL Input */}
      {inputMode === 'url' && (
        <div className="space-y-3">
          <SmartFieldInput
            label="URL"
            value={smartFields.url}
            onChange={(v) => { setSmartField('url', v); setInputData(v); setBarcodeFormat('qrcode'); }}
            placeholder="https://example.com"
            type="url"
          />
        </div>
      )}

      {/* vCard Input */}
      {inputMode === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <SmartFieldInput label="First Name" value={smartFields.firstName} onChange={(v) => setSmartField('firstName', v)} placeholder="John" />
            <SmartFieldInput label="Last Name" value={smartFields.lastName} onChange={(v) => setSmartField('lastName', v)} placeholder="Doe" />
          </div>
          <SmartFieldInput label="Phone" value={smartFields.phone} onChange={(v) => setSmartField('phone', v)} placeholder="+1234567890" type="tel" />
          <SmartFieldInput label="Email" value={smartFields.email} onChange={(v) => setSmartField('email', v)} placeholder="john@example.com" type="email" />
          <SmartFieldInput label="Organization" value={smartFields.org} onChange={(v) => setSmartField('org', v)} placeholder="Acme Inc." />
          <SmartFieldInput label="Job Title" value={smartFields.title} onChange={(v) => setSmartField('title', v)} placeholder="CEO" />
          <SmartFieldInput label="Website" value={smartFields.url} onChange={(v) => setSmartField('url', v)} placeholder="https://example.com" />
          <button onClick={applySmartData} className="btn-primary w-full text-sm">
            Generate vCard QR <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* WiFi Input */}
      {inputMode === 'wifi' && (
        <div className="space-y-3">
          <SmartFieldInput label="Network Name (SSID)" value={smartFields.ssid} onChange={(v) => setSmartField('ssid', v)} placeholder="MyWiFi" />
          <SmartFieldInput label="Password" value={smartFields.password} onChange={(v) => setSmartField('password', v)} placeholder="••••••••" type="password" />
          <div>
            <label className="label-text">Encryption</label>
            <select
              value={smartFields.encryption}
              onChange={(e) => setSmartField('encryption', e.target.value)}
              className="input-field text-sm"
            >
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <button onClick={applySmartData} className="btn-primary w-full text-sm">
            Generate WiFi QR <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Email Input */}
      {inputMode === 'email' && (
        <div className="space-y-3">
          <SmartFieldInput label="To" value={smartFields.emailTo} onChange={(v) => setSmartField('emailTo', v)} placeholder="hello@example.com" type="email" />
          <SmartFieldInput label="Subject" value={smartFields.emailSubject} onChange={(v) => setSmartField('emailSubject', v)} placeholder="Subject line" />
          <div>
            <label className="label-text">Body</label>
            <textarea
              value={smartFields.emailBody}
              onChange={(e) => setSmartField('emailBody', e.target.value)}
              placeholder="Email body..."
              rows={2}
              className="input-field text-sm resize-none"
            />
          </div>
          <button onClick={applySmartData} className="btn-primary w-full text-sm">
            Generate Email QR <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* SMS Input */}
      {inputMode === 'sms' && (
        <div className="space-y-3">
          <SmartFieldInput label="Phone Number" value={smartFields.smsPhone} onChange={(v) => setSmartField('smsPhone', v)} placeholder="+1234567890" type="tel" />
          <div>
            <label className="label-text">Message</label>
            <textarea
              value={smartFields.smsMessage}
              onChange={(e) => setSmartField('smsMessage', e.target.value)}
              placeholder="Hello..."
              rows={2}
              className="input-field text-sm resize-none"
            />
          </div>
          <button onClick={applySmartData} className="btn-primary w-full text-sm">
            Generate SMS QR <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Phone Input */}
      {inputMode === 'phone' && (
        <div className="space-y-3">
          <SmartFieldInput label="Phone Number" value={smartFields.phoneNumber} onChange={(v) => setSmartField('phoneNumber', v)} placeholder="+1234567890" type="tel" />
          <button onClick={applySmartData} className="btn-primary w-full text-sm">
            Generate Phone QR <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Format Suggestion */}
      <AnimatePresence>
        {suggestedFormat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button
              onClick={() => setBarcodeFormat(suggestedFormat.id)}
              className="w-full flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Lightbulb size={16} />
              <span>
                Tip: <strong>{suggestedFormat.name}</strong> might be a better match for this input
              </span>
              <ArrowRight size={14} className="ml-auto" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
