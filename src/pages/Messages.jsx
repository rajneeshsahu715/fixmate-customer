import { useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";

import Card from "../components/Card";

const conversations = [
  {
    id: 1,
    name: "Vikas Verma",
    role: "AC Repair Specialist",
    initials: "VV",
    lastMessage: "I will reach by 10:00 AM tomorrow.",
    time: "10:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Neha Sharma",
    role: "Home Cleaning Professional",
    initials: "NS",
    lastMessage: "Thank you for choosing FixMate.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Plumbing Professional",
    initials: "AP",
    lastMessage: "Please share a photo of the leakage.",
    time: "12 Sep",
    unread: 0,
    online: false,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "professional",
    text: "Hello! I am Vikas from FixMate.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "customer",
    text: "Hi Vikas, I booked an AC service for tomorrow.",
    time: "10:34 AM",
  },
  {
    id: 3,
    sender: "professional",
    text: "Yes, I have received the booking.",
    time: "10:36 AM",
  },
  {
    id: 4,
    sender: "customer",
    text: "Great. Please call me when you are nearby.",
    time: "10:39 AM",
  },
  {
    id: 5,
    sender: "professional",
    text: "Sure. I will reach by 10:00 AM tomorrow.",
    time: "10:42 AM",
  },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] =
    useState(conversations[0]);

  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const filteredConversations = conversations.filter((conversation) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      !query ||
      conversation.name.toLowerCase().includes(query) ||
      conversation.role.toLowerCase().includes(query) ||
      conversation.lastMessage.toLowerCase().includes(query)
    );
  });

  const handleSend = () => {
    const text = message.trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "customer",
        text,
        time: "Now",
      },
    ]);

    setMessage("");
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-background">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Heading */}
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Communication
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            Messages
          </h1>

          <p className="mt-3 text-base text-text-secondary">
            Stay connected with your FixMate professionals.
          </p>
        </div>

        {/* Chat */}
        <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
          {/* Conversation Sidebar */}
          <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <div className="border-b border-slate-100 p-4">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-slate-200 bg-background py-2.5 pl-10 pr-3 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div className="max-h-[430px] overflow-y-auto lg:max-h-[580px]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => {
                  const selected =
                    selectedConversation.id === conversation.id;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => setSelectedConversation(conversation)}
                      className={`flex w-full items-start gap-3 border-b border-slate-100 p-4 text-left transition-colors ${
                        selected
                          ? "bg-primary-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-700">
                          {conversation.initials}
                        </div>

                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-bold text-primary-900">
                            {conversation.name}
                          </p>

                          <span className="shrink-0 text-[11px] text-text-muted">
                            {conversation.time}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs font-medium text-primary-600">
                          {conversation.role}
                        </p>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="truncate text-xs text-text-muted">
                            {conversation.lastMessage}
                          </p>

                          {conversation.unread > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center">
                  <Search
                    size={25}
                    className="mx-auto text-text-muted"
                  />

                  <p className="mt-3 text-sm font-semibold text-primary-900">
                    No conversations found
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Try another search.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Chat Window */}
          <div className="flex min-h-[650px] flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-700">
                  {selectedConversation.initials}
                </div>

                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-primary-900">
                    {selectedConversation.name}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-success">
                    <ShieldCheck size={11} />
                    Verified
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-text-muted">
                  {selectedConversation.online
                    ? "Online now"
                    : selectedConversation.role}
                </p>
              </div>
            </div>

            {/* Booking context */}
            <div className="border-b border-slate-100 bg-background px-5 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary">
                <span>
                  Service:{" "}
                  <strong className="text-text-primary">
                    AC Repair & Service
                  </strong>
                </span>

                <span>
                  Booking ID:{" "}
                  <strong className="text-text-primary">
                    FM-2026-00124
                  </strong>
                </span>

                <span className="font-semibold text-emerald-600">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-white p-5 sm:p-6">
              <div className="py-3 text-center">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-text-muted">
                  Today
                </span>
              </div>

              {messages.map((item) => {
                const isCustomer = item.sender === "customer";

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      isCustomer
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[65%] ${
                        isCustomer
                          ? "items-end"
                          : "items-start"
                      } flex flex-col`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                          isCustomer
                            ? "rounded-br-md bg-primary-600 text-white"
                            : "rounded-bl-md bg-slate-100 text-text-primary"
                        }`}
                      >
                        {item.text}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-text-muted">
                        <span>{item.time}</span>

                        {isCustomer && (
                          <CheckCheck
                            size={13}
                            className="text-primary-600"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  className="min-h-[50px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition-colors hover:bg-primary-700"
                  aria-label="Send message"
                >
                  <Send size={19} />
                </button>
              </div>

              <p className="mt-2 flex items-center gap-1 text-[10px] text-text-muted">
                <MessageCircle size={12} />
                Never share sensitive payment information in chat.
              </p>
            </div>
          </div>
        </div>

        {/* Safety note */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-success"
          />

          <div>
            <p className="text-sm font-semibold text-primary-900">
              Stay safe on FixMate
            </p>

            <p className="mt-1 text-xs leading-5 text-text-secondary">
              Keep payments and important communication inside the
              FixMate platform. Never share passwords, OTPs, or
              card details with anyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;