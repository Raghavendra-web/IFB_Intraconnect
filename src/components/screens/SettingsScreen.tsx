import React, { useState } from 'react';
import {
  Bell,
  Cpu,
  Monitor,
  Shield,
  Volume2,
  HardDrive,
  Radio,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Zap,
  Terminal,
  Activity,
  VolumeX,
  Sun,
  Moon,
  Building2
} from 'lucide-react';
import { IfbBrandLogo } from '../IfbBrandLogo';

interface SettingsScreenProps {
  onShowToast: (msg: string) => void;
  theme?: 'dark' | 'light';
  onSetTheme?: (theme: 'dark' | 'light') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onShowToast,
  theme = 'light',
  onSetTheme
}) => {
  const [activeTab, setActiveTab] = useState<
    'telemetry' | 'terminal' | 'alarms' | 'profile' | 'system'
  >('telemetry');

  // Telemetry Settings State
  const [mqttBroker, setMqttBroker] = useState('tcp://192.168.1.100:1883');
  const [modbusSlaveId, setModbusSlaveId] = useState('0x04');
  const [pollingInterval, setPollingInterval] = useState('500ms');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<string | null>(null);

  // Terminal Settings State
  const [screenSleepTimeout, setScreenSleepTimeout] = useState('15 Minutes (Standby)');
  const [keyboardLayout, setKeyboardLayout] = useState('Standard Touch');
  const [highContrastTheme, setHighContrastTheme] = useState(false);
  const [touchHapticFeedback, setTouchHapticFeedback] = useState(true);

  // Audible Alarms Settings State
  const [alarmVolume, setAlarmVolume] = useState(72);
  const [shiftChangeChime, setShiftChangeChime] = useState(true);
  const [criticalKlaxonAlert, setCriticalKlaxonAlert] = useState(true);
  const [isPlayingAlarmTest, setIsPlayingAlarmTest] = useState(false);

  // Profile State
  const [operatorName, setOperatorName] = useState('Rajeshwar Pillai');
  const [badgeId, setBadgeId] = useState('IFB-PL-0419');
  const [rfidKey, setRfidKey] = useState('04:F2:88:AC:3B:90');

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionTestResult('1.8ms response — OK (Modbus TCP & MQTT Synced)');
      onShowToast('Network ping: 1.8ms latency, zero packet loss.');
    }, 700);
  };

  const handleTestAlarmSound = () => {
    setIsPlayingAlarmTest(true);
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(440, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // AudioContext fallback
    }

    setTimeout(() => {
      setIsPlayingAlarmTest(false);
      onShowToast(`Audible notification chime tested at ${alarmVolume} dB.`);
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-[#F0F2F5] p-4 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-[#111B21]">
              Station & Messenger Settings
            </h2>
            <span className="text-[12px] text-[#1e88e5] bg-[#E7F3FF] border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
              Station Node 17
            </span>
          </div>
          <p className="text-[13px] text-[#667781] mt-0.5">
            Preferences for notifications, terminal display, network links, and operator credentials
          </p>
        </div>

        <button
          onClick={() => onShowToast('All preferences successfully saved.')}
          className="h-[36px] px-4 bg-[#1e88e5] hover:bg-[#1565c0] text-white text-[13px] font-medium rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <Zap className="w-4 h-4" />
          Save Preferences
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 mb-4 flex-shrink-0 text-[12px] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
            activeTab === 'telemetry'
              ? 'bg-[#E7F3FF] text-[#1e88e5]'
              : 'bg-white text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21] border border-[#E9EDEF]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Telemetry & Protocols
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
            activeTab === 'terminal'
              ? 'bg-[#E7F3FF] text-[#1e88e5]'
              : 'bg-white text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21] border border-[#E9EDEF]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Terminal & Appearance
        </button>

        <button
          onClick={() => setActiveTab('alarms')}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
            activeTab === 'alarms'
              ? 'bg-[#E7F3FF] text-[#1e88e5]'
              : 'bg-white text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21] border border-[#E9EDEF]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          Sound & Notifications
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
            activeTab === 'profile'
              ? 'bg-[#E7F3FF] text-[#1e88e5]'
              : 'bg-white text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21] border border-[#E9EDEF]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Operator Profile & RFID
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
            activeTab === 'system'
              ? 'bg-[#E7F3FF] text-[#1e88e5]'
              : 'bg-white text-[#667781] hover:bg-[#F0F2F5] hover:text-[#111B21] border border-[#E9EDEF]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          System Diagnostics
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 flex flex-col gap-4">
        {/* ========================================================
            TAB 1: TELEMETRY & PROTOCOLS
            ======================================================== */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Telemetry Configuration Card */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 flex flex-col gap-4 shadow-2xs text-[13px]">
              <div className="flex items-center justify-between border-b border-[#E9EDEF] pb-3">
                <span className="font-semibold text-[#111B21] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#1e88e5]" />
                  Telemetry Bus Protocol Settings
                </span>
                <span className="text-[11px] text-[#00a884] bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
                  Realtime Link
                </span>
              </div>

              {/* MQTT Broker host/port */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#667781] font-medium flex items-center justify-between">
                  <span>MQTT Broker Host / Port</span>
                  <span className="text-[#00a884]">Port 1883 Open</span>
                </label>
                <input
                  type="text"
                  value={mqttBroker}
                  onChange={(e) => setMqttBroker(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] font-mono-code focus:outline-none"
                />
              </div>

              {/* Modbus TCP Slave ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#667781] font-medium">Modbus TCP Slave ID</label>
                <input
                  type="text"
                  value={modbusSlaveId}
                  onChange={(e) => setModbusSlaveId(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] font-mono-code focus:outline-none"
                />
              </div>

              {/* Polling Interval Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#667781] font-medium">Sensor & PLC Polling Interval</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['250ms', '500ms', '1000ms', '2000ms'] as const).map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      onClick={() => setPollingInterval(interval)}
                      className={`h-[34px] rounded-xl border text-[12px] font-mono-code font-medium cursor-pointer transition-all ${
                        pollingInterval === interval
                          ? 'bg-[#E7F3FF] text-[#1e88e5] border-blue-200'
                          : 'bg-[#F0F2F5] text-[#667781] border-transparent hover:bg-[#E9EDEF] hover:text-[#111B21]'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Connection Button */}
              <div className="pt-3 border-t border-[#E9EDEF] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    className="h-[36px] px-4 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#1e88e5] rounded-xl flex items-center gap-2 cursor-pointer font-medium transition-colors"
                  >
                    <Radio className={`w-4 h-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
                    <span>{isTestingConnection ? 'Pinging Broker...' : 'Test SCADA Connection'}</span>
                  </button>

                  <span className="text-[12px] text-[#667781]">PROFINET Class 3</span>
                </div>

                {connectionTestResult && (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[12px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{connectionTestResult}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Industrial Network Diagnostics Status */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 flex flex-col justify-between shadow-2xs text-[13px]">
              <div>
                <div className="flex items-center justify-between border-b border-[#E9EDEF] pb-3 mb-3">
                  <span className="font-semibold text-[#111B21] flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#00a884]" />
                    Active Bus Telemetry Snapshot
                  </span>
                  <span className="text-[#00a884] font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                    Synchronized
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]/60">
                    <span className="text-[#667781]">Interface Adapter:</span>
                    <span className="text-[#111B21] font-medium">eth0 (Siemens CP 1623 PCIe)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]/60">
                    <span className="text-[#667781]">Subnet IP / Mask:</span>
                    <span className="text-[#1e88e5] font-mono-code font-medium">192.168.1.17 / 255.255.255.0</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]/60">
                    <span className="text-[#667781]">Modbus Registers:</span>
                    <span className="text-[#111B21] font-mono-code">40001–40256 (256 channels)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E9EDEF]/60">
                    <span className="text-[#667781]">Packet Loss:</span>
                    <span className="text-[#00a884] font-medium">0.000% (Lossless)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#667781]">Master Watchdog:</span>
                    <span className="text-[#00a884] font-medium">Healthy (Tick 240ms)</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F0F2F5] p-3 rounded-xl text-[12px] text-[#667781] mt-4">
                Telemetry streams are buffered locally in SQLite cache during network dropouts to guarantee zero telemetry loss.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: TERMINAL & APPEARANCE
            ======================================================== */}
        {activeTab === 'terminal' && (
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 flex flex-col gap-4 text-[13px] shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E9EDEF] pb-3">
              <span className="font-semibold text-[#111B21] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#1e88e5]" />
                Workstation Display & Appearance
              </span>
              <span className="text-[12px] text-[#667781]">Calibrated Interface</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Screen Sleep Timeout */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#667781] font-medium">Screen Sleep / Standby Timeout</label>
                <select
                  value={screenSleepTimeout}
                  onChange={(e) => setScreenSleepTimeout(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none cursor-pointer"
                >
                  <option value="Never (Always On)">Never (Always On for Critical Lines)</option>
                  <option value="15 Minutes (Standby)">15 Minutes (Standby)</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="60 Minutes">60 Minutes</option>
                </select>
              </div>

              {/* Touch Keyboard Layout */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#667781] font-medium">Virtual Touch Keyboard Layout</label>
                <select
                  value={keyboardLayout}
                  onChange={(e) => setKeyboardLayout(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21] focus:outline-none cursor-pointer"
                >
                  <option value="Standard Touch">Standard Touch Keyboard</option>
                  <option value="Numeric Only">Numeric Only (Fast PIN/Part entry)</option>
                  <option value="Industrial Keypad">Industrial Keypad (Large Glove Targets)</option>
                </select>
              </div>
            </div>

            {/* Display Theme Selector */}
            <div className="pt-3 border-t border-[#E9EDEF] flex flex-col gap-3">
              <div className="flex flex-col gap-2 bg-[#F0F2F5] p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#111B21] block">
                      Messenger Interface Theme
                    </span>
                    <span className="text-[12px] text-[#667781]">
                      Switch between clean light team mode and low-glare dark mode
                    </span>
                  </div>
                  <span className="text-[11px] text-[#1e88e5] bg-[#E7F3FF] px-2.5 py-0.5 rounded-full font-medium uppercase">
                    Active: {theme}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {/* Light Mode Option */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetTheme) onSetTheme('light');
                      onShowToast('Light messenger mode selected.');
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white border-[#1e88e5] shadow-xs'
                        : 'bg-white/60 border-[#E9EDEF] hover:border-[#cbd5e1] text-[#667781]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-semibold ${theme === 'light' ? 'text-[#1e88e5]' : 'text-[#111B21]'}`}>
                        Clean Light Mode (Recommended)
                      </span>
                      <span className="text-[11px] text-[#667781] mt-0.5">
                        WhatsApp/Telegram consumer styling, warm light gray shell
                      </span>
                    </div>
                  </button>

                  {/* Dark Mode Option */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onSetTheme) onSetTheme('dark');
                      onShowToast('Dark mode selected.');
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#1a222d] border-[#1e88e5] shadow-xs'
                        : 'bg-white/60 border-[#E9EDEF] hover:border-[#cbd5e1] text-[#667781]'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-[#111B21] text-blue-400 mt-0.5">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-semibold ${theme === 'dark' ? 'text-[#00d4ff]' : 'text-[#111B21]'}`}>
                        Dark Mode
                      </span>
                      <span className="text-[11px] text-[#667781] mt-0.5">
                        Night shifts, low-light station environments
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Touch Haptic Feedback */}
              <div className="flex items-center justify-between bg-[#F0F2F5] p-3.5 rounded-xl">
                <div className="flex flex-col">
                  <span className="font-semibold text-[#111B21]">
                    Touch & Keystroke Sound
                  </span>
                  <span className="text-[12px] text-[#667781]">
                    Acoustic feedback on button clicks and message dispatch
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={touchHapticFeedback}
                    onChange={(e) => setTouchHapticFeedback(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e88e5]"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: SOUND & NOTIFICATIONS
            ======================================================== */}
        {activeTab === 'alarms' && (
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 flex flex-col gap-4 text-[13px] shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E9EDEF] pb-3">
              <span className="font-semibold text-[#111B21] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#1e88e5]" />
                Audible Alerts & Notifications
              </span>
              <span className="text-[12px] text-[#00a884] font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Audio Active
              </span>
            </div>

            {/* Volume slider with decibel level indicator */}
            <div className="bg-[#F0F2F5] p-4 rounded-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-[#111B21] flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#1e88e5]" />
                    Master Station Speaker Volume
                  </span>
                  <span className="text-[12px] text-[#667781]">
                    Adjust output level for incoming alerts and shift chimes
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[18px] font-bold font-mono-code text-[#1e88e5]">{alarmVolume} dB</span>
                  <span className="text-[11px] text-[#00a884] block font-medium">Optimal level</span>
                </div>
              </div>

              <input
                type="range"
                min={45}
                max={95}
                value={alarmVolume}
                onChange={(e) => setAlarmVolume(Number(e.target.value))}
                className="w-full accent-[#1e88e5] cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#667781]">
                <span>45 dB (Quiet Office)</span>
                <span>72 dB (Assembly Bay Standard)</span>
                <span>95 dB (High Noise Machinery)</span>
              </div>
            </div>

            {/* Test Alarm Sound Button */}
            <div className="flex items-center justify-between bg-[#F0F2F5] p-3.5 rounded-xl">
              <div>
                <span className="font-semibold text-[#111B21] block">
                  Test Notification Chime
                </span>
                <span className="text-[12px] text-[#667781]">
                  Plays acoustic alert sample to verify speakers
                </span>
              </div>

              <button
                type="button"
                onClick={handleTestAlarmSound}
                disabled={isPlayingAlarmTest}
                className="h-[36px] px-4 bg-white border border-[#E9EDEF] hover:bg-[#E9EDEF] text-[#111B21] rounded-xl font-medium flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Volume2 className="w-4 h-4 text-[#1e88e5]" />
                <span>{isPlayingAlarmTest ? 'Playing Tone...' : 'Test Sound'}</span>
              </button>
            </div>

            {/* Shift Change Chime Toggle */}
            <div className="flex items-center justify-between bg-[#F0F2F5] p-3.5 rounded-xl">
              <div>
                <span className="font-semibold text-[#111B21] block">
                  Shift Change Chime
                </span>
                <span className="text-[12px] text-[#667781]">
                  Automated chime at 06:00, 14:30, and 23:00 handover
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shiftChangeChime}
                  onChange={(e) => setShiftChangeChime(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e88e5]"></div>
              </label>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: OPERATOR PROFILE & RFID
            ======================================================== */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4">
            {/* Corporate Plant Identity Banner */}
            <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#F0F2F5] rounded-xl border border-[#E9EDEF]">
                  <IfbBrandLogo variant="full" height={44} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#111B21] leading-tight">
                    IFB Automotive Pvt Ltd
                  </h3>
                  <p className="text-[12px] text-[#667781] mt-0.5">
                    Manufacturing Complex · Assembly & Systems Hub
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-[#1e88e5] bg-[#E7F3FF] border border-blue-200 px-2.5 py-1 rounded-full">
                  Corporate Enterprise Node
                </span>
                <span className="text-[11px] text-[#667781] block mt-1">
                  License: IND-IFB-2026-APL
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 flex flex-col gap-4 text-[13px] shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E9EDEF] pb-3">
                <span className="font-semibold text-[#111B21] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#1e88e5]" />
                  Logged Operator Credentials
                </span>
                <span className="text-[12px] text-[#00a884] font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Authenticated
                </span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Supervisor Name</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#111B21]"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Operator ID</label>
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="h-[38px] bg-[#F0F2F5] border border-transparent focus:border-[#1e88e5] focus:bg-white rounded-xl px-3 text-[#1e88e5] font-mono-code font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Mifare RFID Serial UID</label>
                <input
                  type="text"
                  value={rfidKey}
                  readOnly
                  className="h-[38px] bg-[#F0F2F5] border border-transparent rounded-xl px-3 text-[#667781] font-mono-code"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[#667781] font-medium">Security Clearance</label>
                <div className="h-[38px] bg-emerald-50 border border-emerald-200 rounded-xl px-3 flex items-center text-emerald-800 font-medium">
                  Class 4 (Supervisor Override + Dispatch)
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ========================================================
            TAB 5: SYSTEM DIAGNOSTICS
            ======================================================== */}
        {activeTab === 'system' && (
          <div className="bg-white border border-[#E9EDEF] rounded-xl p-5 flex flex-col gap-4 text-[13px] shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E9EDEF] pb-3">
              <span className="font-semibold text-[#111B21] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1e88e5]" />
                Workstation Hardware Metrics
              </span>
              <span className="text-[11px] text-[#667781] font-mono-code">Kernel v6.1-RT</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#F0F2F5] p-3.5 rounded-xl">
                <span className="text-[#667781] text-[11px] block">CPU Load</span>
                <span className="text-[20px] font-bold font-mono-code text-[#111B21]">34.2%</span>
                <span className="text-[#00a884] text-[11px] block font-medium">Temp 41.8°C (Normal)</span>
              </div>

              <div className="bg-[#F0F2F5] p-3.5 rounded-xl">
                <span className="text-[#667781] text-[11px] block">Memory</span>
                <span className="text-[20px] font-bold font-mono-code text-[#111B21]">1.2 / 4.0 GB</span>
                <span className="text-[#667781] text-[11px] block">30% Allocated</span>
              </div>

              <div className="bg-[#F0F2F5] p-3.5 rounded-xl">
                <span className="text-[#667781] text-[11px] block">Storage</span>
                <span className="text-[20px] font-bold font-mono-code text-[#111B21]">14.8 / 32 GB</span>
                <span className="text-[#00a884] text-[11px] block font-medium">Wear Level 4%</span>
              </div>

              <div className="bg-[#F0F2F5] p-3.5 rounded-xl">
                <span className="text-[#667781] text-[11px] block">Node Uptime</span>
                <span className="text-[20px] font-bold font-mono-code text-[#00a884]">14d 06h</span>
                <span className="text-[#667781] text-[11px] block">0 Crashes</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E9EDEF] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onShowToast('Self-test diagnostic passed: All systems nominal.')}
                className="px-4 py-2 bg-[#F0F2F5] hover:bg-[#E9EDEF] text-[#111B21] rounded-xl text-[12px] font-medium cursor-pointer transition-colors"
              >
                Run Hardware Self-Test
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Reboot command rejected: Terminal is locked in active shift.')}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[12px] font-medium cursor-pointer transition-colors"
              >
                Reboot Node
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
