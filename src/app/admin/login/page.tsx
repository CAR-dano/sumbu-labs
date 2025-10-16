"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowRight, UserCircle } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  id: string;
  fullName: string;
  nickname?: string;
  photoUrl?: string;
  roleName: string;
}

export default function TeamLoginPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/auth/team-members");
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members);
      } else {
        toast({
          title: "Error",
          description: "Failed to load team members",
          variant: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "error",
      });
    } finally {
      setLoadingMembers(false);
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!selectedMember || pin.length < 4) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/team-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selectedMember.id,
          pin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Access Denied",
          description: data.error || "Invalid PIN",
          variant: "error",
        });
        setPin("");
        return;
      }

      toast({
        title: "Welcome Back!",
        description: `${selectedMember.fullName}, accessing dashboard...`,
      });

      setTimeout(() => {
        window.location.href = "/admin";
      }, 500);
    } catch {
      toast({
        title: "Connection Error",
        description: "Unable to reach authentication server",
        variant: "error",
      });
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && pin.length >= 4) {
      handleSubmit();
    } else if (e.key === "Backspace") {
      handleBackspace();
    } else if (/^\d$/.test(e.key)) {
      handlePinInput(e.key);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0f1a] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Image
              src="/assets/logo/sumbu.svg"
              alt="Sumbu Labs"
              width={120}
              height={120}
              className="drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-10 overflow-visible group hover:border-white/20 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl overflow-hidden pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-8 space-y-3">
              <h1 className="text-3xl md:text-4xl font-roboto font-bold text-white tracking-wide uppercase">
                Team Access
              </h1>
              <p className="text-gray-400 text-sm font-roboto font-light tracking-wide">
                {selectedMember ? "Enter your PIN" : "Select your profile"}
              </p>
            </div>

            {!selectedMember && (
              <div className="space-y-4 overflow-visible">
                {loadingMembers ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-2 border-white/30 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-8 max-h-[400px] overflow-y-auto pr-2 py-6 px-2 custom-scrollbar"
                    style={{ overflow: "visible" }}
                  >
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="relative"
                        style={{
                          padding: "4px",
                          margin: "-4px",
                        }}
                      >
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="account-card w-full relative rounded-2xl group/card overflow-visible"
                        >
                          {/* Outer glow layer - expands beyond button */}
                          <div
                            className="absolute rounded-2xl opacity-0 group-hover/card:opacity-100 transition-all duration-300 pointer-events-none"
                            style={{
                              inset: "-8px",
                              background:
                                "radial-gradient(circle at center, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
                              filter: "blur(12px)",
                            }}
                          />

                          {/* Border glow */}
                          <div
                            className="absolute rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                              inset: "-1px",
                              background:
                                "linear-gradient(135deg, rgba(168,85,247,0.6), rgba(124,58,237,0.4))",
                              zIndex: 0,
                            }}
                          />

                          {/* Main card content */}
                          <div
                            className="relative rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 p-6 transition-all duration-300 ease-out group-hover/card:scale-105 group-hover/card:border-transparent group-hover/card:bg-white/[0.08]"
                            style={{
                              willChange: "transform",
                              backfaceVisibility: "hidden",
                              transform: "translateZ(0)",
                              zIndex: 1,
                            }}
                          >
                            <div className="flex flex-col items-center gap-3">
                              {member.photoUrl ? (
                                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10 group-hover/card:ring-purple-400/60 transition-all duration-300">
                                  <Image
                                    src={member.photoUrl}
                                    alt={member.fullName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center ring-2 ring-white/10 group-hover/card:ring-purple-400/60 transition-all duration-300">
                                  <UserCircle className="w-10 h-10 text-purple-400" />
                                </div>
                              )}
                              <div className="text-center">
                                <h3 className="text-white font-roboto font-medium text-sm">
                                  {member.nickname || member.fullName}
                                </h3>
                                <p className="text-gray-500 text-xs font-roboto font-light mt-1">
                                  {member.roleName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedMember && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  {selectedMember.photoUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500/50">
                      <Image
                        src={selectedMember.photoUrl}
                        alt={selectedMember.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center ring-2 ring-purple-500/50">
                      <UserCircle className="w-8 h-8 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-roboto font-medium">
                      {selectedMember.fullName}
                    </h3>
                    <p className="text-gray-400 text-sm font-roboto font-light">
                      {selectedMember.roleName}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMember(null);
                      setPin("");
                    }}
                    className="ml-auto text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                <div className="flex justify-center gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        i < pin.length
                          ? "bg-gradient-to-br from-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110"
                          : "bg-white/[0.03] border border-white/10"
                      }`}
                    >
                      {i < pin.length && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                  ))}
                </div>

                <div
                  className="grid grid-cols-3 gap-3"
                  onKeyDown={handleKeyPress}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handlePinInput(String(digit))}
                      disabled={loading || pin.length >= 6}
                      className="h-14 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.05] text-white font-roboto font-medium text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    onClick={handleBackspace}
                    disabled={loading || pin.length === 0}
                    className="h-14 rounded-xl bg-white/[0.03] border border-white/10 hover:border-red-500/50 hover:bg-white/[0.05] text-white font-roboto font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handlePinInput("0")}
                    disabled={loading || pin.length >= 6}
                    className="h-14 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.05] text-white font-roboto font-medium text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    0
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || pin.length < 4}
                    className="h-14 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-roboto font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-center text-gray-500 text-xs font-roboto font-light">
                  Enter 4-6 digit PIN
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-xs font-roboto font-light">
                Authorized team members only
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full" />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }

        /* Force overflow visible on grid container */
        .custom-scrollbar {
          overflow-x: visible !important;
        }

        /* Ensure card hover effects are not clipped */
        .account-card {
          position: relative;
          display: block;
          isolation: isolate;
        }

        .account-card:hover {
          z-index: 20;
        }
      `}</style>
    </div>
  );
}
