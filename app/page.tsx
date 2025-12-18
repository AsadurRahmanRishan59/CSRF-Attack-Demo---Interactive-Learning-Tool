'use client';
import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertTriangle, CheckCircle, Code, ExternalLink } from 'lucide-react';

interface LogEntry {
  message: string;
  type: 'info' | 'success' | 'danger' | 'warning';
  time: string;
}

export default function CSRFDemo() {
  const [activeTab, setActiveTab] = useState<'vulnerable' | 'protected'>('vulnerable');
  const [balance, setBalance] = useState(1000);
  const [csrfToken, setCsrfToken] = useState('');
  const [attackLog, setAttackLog] = useState<LogEntry[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulate login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setBalance(1000);
    setAttackLog([]);
    
    // Generate CSRF token only for protected version
    if (activeTab === 'protected') {
      const token = 'csrf-' + crypto.randomUUID().substring(0, 9);
      setCsrfToken(token);
      addLog('✅ Login successful! CSRF token generated: ' + token, 'success');
    } else {
      addLog('✅ Login successful! (No CSRF protection)', 'success');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCsrfToken('');
    setBalance(1000);
    setAttackLog([]);
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setAttackLog(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  // Legitimate transfer (from your own site)
  const legitimateTransfer = (amount: number) => {
    addLog(`📤 Legitimate request from YourBank.com`, 'info');
    addLog(`🍪 Cookie: session=abc123 (sent automatically)`, 'info');
    
    if (activeTab === 'protected') {
      addLog(`🔑 Header: X-CSRF-TOKEN=${csrfToken} (added by your JS)`, 'info');
      addLog(`✅ Server validated: Cookie token matches header token`, 'success');
    }
    
    setBalance(prev => prev - amount);
    addLog(`✅ Transfer successful! $${amount} sent`, 'success');
  };

  // Malicious transfer (from attacker's site)
  const maliciousTransfer = (amount: number) => {
    addLog(`🚨 Malicious request from EvilSite.com`, 'danger');
    addLog(`🍪 Cookie: session=abc123 (browser sends automatically!)`, 'warning');
    
    if (activeTab === 'protected') {
      addLog(`❌ Header: X-CSRF-TOKEN=missing (attacker can't read cookie!)`, 'danger');
      addLog(`🛡️ Server rejected: No CSRF token in header`, 'danger');
      addLog(`❌ Transfer blocked!`, 'success');
    } else {
      addLog(`⚠️ No CSRF protection - request looks legitimate!`, 'warning');
      setBalance(prev => prev - amount);
      addLog(`💸 Transfer successful! You just got hacked!`, 'danger');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Shield className="text-blue-400" size={40} />
            CSRF Attack Demo
          </h1>
          <p className="text-slate-400">See how CSRF attacks work and how to prevent them</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-6 bg-slate-800 p-2 rounded-lg">
          <button
            onClick={() => { setActiveTab('vulnerable'); handleLogout(); }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'vulnerable'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <ShieldAlert size={20} />
            Vulnerable Site
          </button>
          <button
            onClick={() => { setActiveTab('protected'); handleLogout(); }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'protected'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Shield size={20} />
            Protected Site
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Your Bank */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">YourBank.com</h2>
              {isLoggedIn ? (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                  Logged In
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-600 text-slate-300 rounded-full text-sm font-semibold">
                  Logged Out
                </span>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-6">Login to access your account</p>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Login
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-slate-900 rounded-lg p-6 mb-6">
                  <p className="text-slate-400 text-sm mb-2">Account Balance</p>
                  <p className="text-4xl font-bold text-white">${balance}</p>
                </div>

                {activeTab === 'protected' && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-400 mt-1" size={20} />
                      <div>
                        <p className="text-green-400 font-semibold mb-1">CSRF Protection Active</p>
                        <p className="text-slate-400 text-sm">Token: {csrfToken}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => legitimateTransfer(100)}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold mb-3 transition-colors"
                >
                  Transfer $100 (Legitimate)
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Evil Site */}
          <div className="bg-slate-800 rounded-xl p-6 border border-red-500/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-red-400">EvilSite.com</h2>
              <ExternalLink className="text-red-400" size={20} />
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 mt-1" size={20} />
                <div>
                  <p className="text-red-400 font-semibold mb-1">Malicious Website</p>
                  <p className="text-slate-400 text-sm">
                    This site will attempt to transfer money from your bank account
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-sm mb-2">Hidden malicious code:</p>
              <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-300">
                <Code className="inline text-red-400 mr-2" size={14} />
                fetch(&apos;yourbank.com/transfer&apos;, {'{'}<br />
                &nbsp;&nbsp;method: &apos;POST&apos;,<br />
                &nbsp;&nbsp;credentials: &apos;include&apos;, // 🍪<br />
                &nbsp;&nbsp;body: &apos;{`{ amount: 500 }`}&apos;<br />
                {'}'});
              </div>
            </div>

            <button
              onClick={() => maliciousTransfer(500)}
              disabled={!isLoggedIn}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isLoggedIn
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isLoggedIn ? '🎯 Launch CSRF Attack' : '⚠️ Login First to See Attack'}
            </button>

            {!isLoggedIn && (
              <p className="text-slate-500 text-sm text-center mt-3">
                (You need to be logged in for the attack to work)
              </p>
            )}
          </div>
        </div>

        {/* Attack Log */}
        {attackLog.length > 0 && (
          <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Request Log</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {attackLog.map((log, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    log.type === 'success'
                      ? 'bg-green-900/20 text-green-400 border border-green-500/30'
                      : log.type === 'danger'
                      ? 'bg-red-900/20 text-red-400 border border-red-500/30'
                      : log.type === 'warning'
                      ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span className="text-slate-500 mr-3">{log.time}</span>
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="mt-6 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">What&apos;s Happening?</h3>
          
          {activeTab === 'vulnerable' ? (
            <div className="space-y-4 text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold mb-1">You visit EvilSite.com while logged into YourBank.com</p>
                  <p className="text-slate-400 text-sm">Your browser stores the session cookie from YourBank</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold mb-1">EvilSite triggers a request to YourBank.com</p>
                  <p className="text-slate-400 text-sm">Could be hidden in an image, form, or JavaScript</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold mb-1">Browser automatically attaches your cookies</p>
                  <p className="text-slate-400 text-sm">YourBank thinks it&apos;s a legitimate request from you!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold mb-1 text-red-400">Money transferred! 💸</p>
                  <p className="text-slate-400 text-sm">No CSRF protection = successful attack</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold mb-1">Login generates a CSRF token</p>
                  <p className="text-slate-400 text-sm">Stored in a readable cookie AND sent to your JavaScript</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold mb-1">Your JavaScript adds token to request header</p>
                  <p className="text-slate-400 text-sm">Legitimate requests include: Cookie + Header</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold mb-1">EvilSite can&apos;t read your cookies</p>
                  <p className="text-slate-400 text-sm">Browser security (Same-Origin Policy) blocks this!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold mb-1 text-green-400">Attack blocked! 🛡️</p>
                  <p className="text-slate-400 text-sm">Server validates: Cookie token must match header token</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}