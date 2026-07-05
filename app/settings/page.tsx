"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage, getDefaultSettings } from "@/lib/storage";
import { validateApiKey } from "@/lib/openai";
import ModelSelector from "@/components/ModelSelector";
import TemperatureSlider from "@/components/TemperatureSlider";
import DarkModeToggle from "@/components/DarkModeToggle";
import CopyButton from "@/components/CopyButton";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState<"gpt-4" | "gpt-3.5-turbo">("gpt-4");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMounted(true);
    const settings = storage.getSettings();
    setApiKey(settings.apiKey);
    setModel(settings.model);
    setSystemPrompt(settings.systemPrompt);
    setTemperature(settings.temperature);
  }, []);

  const handleValidateApiKey = async () => {
    if (!apiKey) {
      setValidationMessage("Please enter an API key");
      return;
    }

    setIsValidating(true);
    const isValid = await validateApiKey(apiKey);
    setValidationMessage(
      isValid ? "✓ API key is valid!" : "✗ Invalid API key. Please check and try again."
    );
    setIsValidating(false);
  };

  const handleSave = () => {
    storage.saveSettings({
      apiKey,
      model,
      systemPrompt,
      temperature,
    });
    setHasChanges(false);
    setValidationMessage("✓ Settings saved successfully!");
    setTimeout(() => setValidationMessage(""), 3000);
  };

  const handleReset = () => {
    const defaults = getDefaultSettings();
    setSystemPrompt(defaults.systemPrompt);
    setTemperature(defaults.temperature);
    setHasChanges(true);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all conversations? This cannot be undone.")) {
      storage.clearAllConversations();
      setValidationMessage("✓ All conversations cleared!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  const handleChange = () => {
    setHasChanges(true);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <DarkModeToggle />
        </div>

        <div className="space-y-8">
          {/* API Key Section */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              OpenAI API Key
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get your API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  handleChange();
                  setValidationMessage("");
                }}
                placeholder="sk-..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleValidateApiKey}
                disabled={isValidating}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isValidating ? "Checking..." : "Validate"}
              </button>
            </div>
            {validationMessage && (
              <p
                className={`text-sm font-medium ${
                  validationMessage.includes("valid")
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {validationMessage}
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
            <ModelSelector
              value={model}
              onChange={(newModel) => {
                setModel(newModel);
                handleChange();
              }}
            />
          </div>

          {/* Temperature */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
            <TemperatureSlider
              value={temperature}
              onChange={(newTemp) => {
                setTemperature(newTemp);
                handleChange();
              }}
            />
          </div>

          {/* System Prompt */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                System Prompt
              </label>
              <button
                onClick={handleReset}
                className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1 rounded transition-colors"
              >
                Reset to Default
              </button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                handleChange();
              }}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={6}
              placeholder="Enter the system prompt that defines the AI's behavior..."
            />
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-red-900 dark:text-red-300">Danger Zone</h2>
            <p className="text-sm text-red-800 dark:text-red-200">
              These actions are permanent and cannot be undone.
            </p>
            <button
              onClick={handleClearHistory}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Clear All Conversations
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Settings
            </button>
            <Link
              href="/"
              className="flex-1 px-4 py-3 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-bold rounded-lg transition-colors text-center"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
