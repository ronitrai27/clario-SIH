"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StepIndicator } from "./stepIndicator";
import { Calendar, Loader2, Share2, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Profession =
  | "10th Student"
  | "12th Student"
  | "Diploma"
  | "Graduate (Bachelor)"
  | "Postgraduate (Master/PhD)";

const PROFESSION_OPTIONS: Profession[] = [
  "10th Student",
  "12th Student",
  "Diploma",
  "Graduate (Bachelor)",
  "Postgraduate (Master/PhD)",
];

const FOCUS_BY_PROFESSION: Record<Profession, string[]> = {
  "10th Student": [
    "Choose career paths",
    "Olympiad preparation",
    "Board exam excellence",
    "Skill building",
  ],
  "12th Student": [
    "Crack competitive exams",
    "Choose career paths",
    "Counseling & guidance",
    "Skill building",
  ],
  Diploma: [
    "Job placement",
    "Internship looking",
    "Higher studies",
    "Skill building",
  ],
  "Graduate (Bachelor)": [
    "Job placement",
    "Internship looking",
    "Startup support",
    "Higher studies",
  ],
  "Postgraduate (Master/PhD)": [
    "Research opportunities",
    "Higher studies (abroad/PhD)",
    "Startup support",
    "Job placement",
  ],
};

type FormData = {
  // Step 1
  name: string;
  dob: string;
  phone: string;
  institution: string;
  acceptedTerms: boolean;
  // Step 2
  profession?: Profession;
  // Step 3
  focus?: string;
  goalNotes?: string;
  // Step 4
  calendarConnected: boolean;
  calendarAccount?: string;
  // Step 5
  invites: string[];
};

export function OnboardingCard() {
  const [step, setStep] = useState<number>(1);
  const [busy, setBusy] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");

  const [data, setData] = useState<FormData>({
    name: "",
    dob: "",
    phone: "",
    institution: "",
    acceptedTerms: false,
    profession: undefined,
    focus: undefined,
    goalNotes: "",
    calendarConnected: false,
    calendarAccount: undefined,
    invites: [],
  });

  const focusOptions = useMemo(() => {
    return data.profession ? FOCUS_BY_PROFESSION[data.profession] : [];
  }, [data.profession]);

  // Validation per step
  const canProceed = useMemo(() => {
    if (busy) return false;
    switch (step) {
      case 1:
        return (
          data.name.trim().length >= 2 &&
          /^\d{4}-\d{2}-\d{2}$/.test(data.dob) &&
          /^[0-9()+\-\s]{7,}$/.test(data.phone.trim()) &&
          data.institution.trim().length >= 2 &&
          data.acceptedTerms
        );
      case 2:
        return !!data.profession;
      case 3:
        return !!data.focus;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  }, [busy, step, data]);

  function nextStep() {
    if (step < 5 && canProceed) setStep((s) => s + 1);
  }
  function prevStep() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function handleConnectCalendar() {
    // Mock connect flow; replace with real OAuth later
    try {
      setBusy(true);
      await new Promise((r) => setTimeout(r, 1000));
      setData((d) => ({
        ...d,
        calendarConnected: true,
        calendarAccount: d.name
          ? `${d.name.split(" ")[0].toLowerCase()}@gmail.com`
          : "you@gmail.com",
      }));
      toast("Google calender connected ", {
        description: (
          <span className="text-gray-600 font-inter">
            your calendar events will be synced
          </span>
        ),
      });
    } finally {
      setBusy(false);
    }
  }

  function handleDisconnectCalendar() {
    setData((d) => ({
      ...d,
      calendarConnected: false,
      calendarAccount: undefined,
    }));
    toast("Google calender disconnected ", {
      description: (
        <span className="text-gray-600 font-inter">
          your calendar events will not be synced
        </span>
      ),
    });
  }

  function addInviteFromInput() {
    const v = emailInput.trim();
    if (!v) return;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!isEmail) {
      toast("Invalid Email ", {
        description: (
          <span className="text-gray-600 font-inter">
            Please enter a valid email
          </span>
        ),
      });
      return;
    }
    setData((d) => {
      if (d.invites.includes(v)) return d;
      return { ...d, invites: [...d.invites, v] };
    });
    setEmailInput("");
  }

  function removeInvite(email: string) {
    setData((d) => ({ ...d, invites: d.invites.filter((e) => e !== email) }));
  }

  async function copyReferral() {
    const link = `${window.location.origin}/invite?ref=${encodeURIComponent(
      data.name || "user"
    )}`;
    await navigator.clipboard.writeText(link);
    toast("Referral link copied ", {
      description: (
        <span className="text-gray-600 font-inter">
          Now you can share it with your friends
        </span>
      ),
    });
  }

  async function shareReferral() {
    const link = `${window.location.origin}/invite?ref=${encodeURIComponent(
      data.name || "user"
    )}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on this platform",
          text: "I’m finding it super helpful — join me!",
          url: link,
        });
      } catch {
        // user canceled
      }
    } else {
      await copyReferral();
    }
  }

  function finish() {
   console.log(data);
  }

  return (
    <Card className="w-full max-w-2xl border-border shadow-sm">
      <CardHeader className="space-y-3">
        <CardTitle className="text-balance">
          Let’s personalize your journey
        </CardTitle>
        <CardDescription className="text-pretty">
          Complete the steps to get tailored guidance for your goals.
        </CardDescription>
        <StepIndicator current={step} onStepClick={(s) => setStep(s)} />
      </CardHeader>

      <CardContent className="space-y-8">
        {step === 1 && (
          <section className="space-y-6" aria-label="Basic information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Aisha Khan"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={data.dob}
                  onChange={(e) => setData({ ...data, dob: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Current school/college</Label>
                <Input
                  id="institution"
                  placeholder="e.g., Delhi Public School"
                  value={data.institution}
                  onChange={(e) =>
                    setData({ ...data, institution: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={data.acceptedTerms}
                onCheckedChange={(v) =>
                  setData({ ...data, acceptedTerms: Boolean(v) })
                }
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                I agree to the Terms and Conditions and consent to receive
                relevant updates.
              </Label>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4" aria-label="Current profile">
            <div className="space-y-2">
              <Label>What best describes you now?</Label>
              <Select
                value={data.profession}
                onValueChange={(v: Profession) => {
                  setData({ ...data, profession: v, focus: undefined });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your current status" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSION_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6" aria-label="Main focus">
            <div className="space-y-2">
              <Label>
                Based on your profile, what’s your main focus right now?
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {focusOptions.map((opt) => {
                  const selected = data.focus === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setData({ ...data, focus: opt })}
                      className={cn(
                        "text-left rounded-md border p-3 transition-colors",
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-border hover:bg-muted"
                      )}
                      aria-pressed={selected}
                    >
                      <div className="font-medium">{opt}</div>
                      <div className="text-xs text-muted-foreground">
                        Personalized resources and roadmap for this goal.
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalNotes">Anything specific to add?</Label>
              <Textarea
                id="goalNotes"
                placeholder="Tell us more (optional)"
                value={data.goalNotes}
                onChange={(e) =>
                  setData({ ...data, goalNotes: e.target.value })
                }
              />
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4" aria-label="Connect Google Calendar">
            <div className="rounded-md border p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="font-medium">
                    Stay on track with calendar reminders
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect Google Calendar to auto-create reminders for
                    milestones, study plans, and application deadlines.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                {!data.calendarConnected ? (
                  <Button
                    onClick={handleConnectCalendar}
                    disabled={busy}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {busy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Connect Google Calendar
                  </Button>
                ) : (
                  <>
                    <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                      Connected as {data.calendarAccount}
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleDisconnectCalendar}
                    >
                      Disconnect
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: This is a demo connection. Replace with real OAuth when
              ready.
            </p>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-6" aria-label="Invite friends">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Invite by email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="friend@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInviteFromInput();
                    }
                  }}
                />
                <Button
                  onClick={addInviteFromInput}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {!!data.invites.length && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.invites.map((e) => (
                    <span
                      key={e}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm"
                    >
                      {e}
                      <button
                        type="button"
                        onClick={() => removeInvite(e)}
                        aria-label={`Remove ${e}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Or share a referral link</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" onClick={copyReferral}>
                  Copy referral link
                </Button>
                <Button
                  onClick={shareReferral}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Friends who join with your link may unlock bonus resources for
                you.
              </p>
            </div>
          </section>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Step {step} of 5</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1 || busy}
          >
            Back
          </Button>
          {step < 5 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={finish}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Finish
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
