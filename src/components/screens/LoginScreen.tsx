import React, { useState, useRef } from 'react';
import {
  Lock,
  Unlock,
  QrCode,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { IfbBrandLogo } from '../IfbBrandLogo';

interface LoginScreenProps {
  onLoginSuccess: (operatorId: string, shift?: string) => void;
  onShowToast: (msg: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onShowToast }) => {
  const [operatorId, setOperatorId] = useState('IFB-PL-0419');
  const [isScanningFocused, setIsScanningFocused] = useState(false);
  const [pinDigits, setPinDigits] = useState<string[]>(['4', '1', '9', '0', '', '']);
  const [rememberSession, setRememberSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const nextPin = [...pinDigits];
    nextPin[index] = digit;
    setPinDigits(nextPin);

    if (digit && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        pinInputRefs.current[index - 1]?.focus();
      } else {
        const nextPin = [...pinDigits];
        nextPin[index] = '';
        setPinDigits(nextPin);
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId.trim()) {
      onShowToast('Please enter an Operator ID.');
      return;
    }

    const pinStr = pinDigits.join('');
    if (pinStr.length < 4) {
      onShowToast('Please enter your 6-digit terminal security PIN.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(operatorId);
    }, 600);
  };

  return (
    <div className="relative w-full h-full bg-[#F0F2F5] flex flex-col items-center justify-between p-6 overflow-y-auto select-none">
      {/* Top clean header bar */}
      <div className="w-full max-w-[500px] pt-2 flex items-center justify-between z-10 text-[12px] text-[#667781]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          <span>Network Connected</span>
        </div>
        <div>
          Workstation 01 · Terminal Active
        </div>
      </div>

      {/* Main Login Card (Clean WhatsApp Web / Slack style) */}
      <div className="relative z-10 w-full max-w-[460px] bg-white border border-[#E9EDEF] rounded-2xl shadow-sm overflow-hidden my-auto p-8 flex flex-col gap-6">
        {/* Card Header: Brand Logo & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2">
            <IfbBrandLogo variant="full" height={58} className="drop-shadow-2xs" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-[20px] font-bold text-[#111B21] tracking-tight">
              Intraconnect
            </h1>
            <span className="text-[11px] font-semibold text-[#1e88e5] bg-[#E7F3FF] border border-blue-200 px-2 py-0.5 rounded-full">
              SCADA Hub
            </span>
          </div>
          <p className="text-[12px] text-[#667781] mt-0.5">
            Secure Workstation Login
          </p>

          {/* 3-Column Status Strip */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[#667781]">
            <span className="flex items-center gap-1.5 bg-[#F0F2F5] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
              Plant Net
            </span>
            <span className="flex items-center gap-1.5 bg-[#F0F2F5] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
              SAP ERP
            </span>
            <span className="flex items-center gap-1.5 bg-[#F0F2F5] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
              MQTT Broker
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          {/* Operator ID Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="operator-id" className="text-[12px] font-medium text-[#111B21]">
              Operator ID
            </label>

            <div className="relative flex items-center">
              <input
                id="operator-id"
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                onFocus={() => setIsScanningFocused(true)}
                onBlur={() => setIsScanningFocused(false)}
                placeholder="e.g. IFB-PL-0419"
                className="w-full h-[42px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3.5 text-[14px] text-[#111B21] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* 6-Digit PIN Boxes */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[12px] font-medium text-[#111B21]">
              Terminal Security PIN
            </label>
            <div className="flex items-center justify-between gap-2">
              {pinDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    pinInputRefs.current[index] = el;
                  }}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(index, e)}
                  className="w-[48px] h-[48px] text-center text-[18px] font-bold bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl text-[#111B21] focus:outline-none transition-all shadow-2xs"
                />
              ))}
            </div>

            <div className="flex items-center justify-end pt-1 text-[11px] text-[#667781]">
              <span>6-digit security PIN</span>
            </div>
          </div>

          {/* Remember session checkbox & Last login */}
          <div className="flex flex-col gap-2 pt-1 text-left">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#54656F]">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="w-4 h-4 rounded text-[#1e88e5] focus:ring-0 cursor-pointer accent-[#1e88e5]"
              />
              <span>Remember workstation session</span>
            </label>
            <span className="text-[11px] text-[#667781]">
              Last login: Today 06:14 AM · Nishant Kumar
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full h-[44px] bg-[#1e88e5] hover:bg-[#1565c0] text-white font-medium text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50 mt-2"
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Enter Workstation</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Footer outside card */}
      <div className="w-full text-center text-[11px] text-[#667781] z-10 py-2">
        IFB Automotive Private Limited · Build v2.4.0
      </div>
    </div>
  );
};
