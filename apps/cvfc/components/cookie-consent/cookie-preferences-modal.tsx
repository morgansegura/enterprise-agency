"use client";

import { useState } from "react";

import { Button, Modal, ModalContent, Switch } from "@wf/ui";

import { consentConfig } from "@/lib/consent-config";
import {
  DENY_ALL,
  GRANT_ALL,
  setConsent,
  useConsent,
  type ConsentChoices,
} from "@/lib/cookie-consent";

import "./cookie-preferences-modal.css";

export function CookiePreferencesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title={consentConfig.modal.title}
        description={consentConfig.modal.description}
        size="md"
      >
        {/* Mount fresh on open so toggles reflect the latest saved choices. */}
        {open ? <PrefsForm onDone={() => onOpenChange(false)} /> : null}
      </ModalContent>
    </Modal>
  );
}

function PrefsForm({ onDone }: { onDone: () => void }) {
  const consent = useConsent();
  const current = consent?.choices ?? DENY_ALL;
  const [analytics, setAnalytics] = useState(current.analytics);
  const [marketing, setMarketing] = useState(current.marketing);

  const save = (choices: ConsentChoices) => {
    setConsent(choices);
    onDone();
  };

  const valueOf = (id: string) =>
    id === "analytics" ? analytics : id === "marketing" ? marketing : true;
  const setterOf = (id: string) =>
    id === "analytics"
      ? setAnalytics
      : id === "marketing"
        ? setMarketing
        : null;

  return (
    <div className="cookie-prefs">
      <header className="cookie-prefs-header">
        <h2 className="cookie-prefs-title">{consentConfig.modal.title}</h2>
        <p className="cookie-prefs-description">
          {consentConfig.modal.description}
        </p>
      </header>

      <ul className="cookie-prefs-list">
        {consentConfig.categories.map((cat) => {
          const setter = setterOf(cat.id);
          return (
            <li key={cat.id} className="cookie-prefs-item">
              <div className="cookie-prefs-item-text">
                <p className="cookie-prefs-item-label">{cat.label}</p>
                <p className="cookie-prefs-item-desc">{cat.description}</p>
              </div>
              <Switch
                checked={valueOf(cat.id)}
                disabled={cat.required}
                onCheckedChange={(checked) => setter?.(checked)}
                aria-label={cat.label}
              />
            </li>
          );
        })}
      </ul>

      <div className="cookie-prefs-actions">
        <Button variant="outline" onClick={() => save(DENY_ALL)}>
          {consentConfig.modal.rejectAll}
        </Button>
        <Button variant="secondary" onClick={() => save(GRANT_ALL)}>
          {consentConfig.modal.acceptAll}
        </Button>
        <Button onClick={() => save({ necessary: true, analytics, marketing })}>
          {consentConfig.modal.save}
        </Button>
      </div>
    </div>
  );
}
