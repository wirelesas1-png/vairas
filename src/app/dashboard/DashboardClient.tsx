"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  formatDate,
  formatTime,
  getMonthNames,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
} from "@/lib/date-utils";

interface Booking {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
}

interface Instructor {
  id: number;
  name: string;
  email: string;
  slug: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
}

interface Props {
  instructor: Instructor;
  bookings: Booking[];
}

export default function DashboardClient({ instructor, bookings }: Props) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Ar tikrai norite atšaukti šią rezervaciją?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const monthNames = getMonthNames();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Adjust first day (0 = Sunday -> 6, 1 = Monday -> 0)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) =>
      isSameDay(new Date(booking.startTime), date)
    );
  };

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/instruktorius/${instructor.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sveiki, {instructor.name}
              </h1>
              <p className="text-sm text-gray-600">
                Prenumerata:{" "}
                <span
                  className={
                    instructor.subscriptionStatus === "active"
                      ? "text-green-600 font-semibold"
                      : instructor.subscriptionStatus === "trial"
                        ? "text-blue-600 font-semibold"
                        : "text-red-600 font-semibold"
                  }
                >
                  {instructor.subscriptionStatus === "active"
                    ? "Aktyvi"
                    : instructor.subscriptionStatus === "trial"
                      ? "Bandomasis laikotarpis"
                      : "Neaktyvi"}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/nustatymai"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Nustatymai
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Atsijungti
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Public Link Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            Jūsų rezervacijų puslapis:
          </h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(publicUrl)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Kopijuoti
            </button>
            <Link
              href={`/instruktorius/${instructor.slug}`}
              target="_blank"
              className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition"
            >
              Peržiūrėti
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Visos rezervacijos</div>
            <div className="text-3xl font-bold text-gray-900">
              {bookings.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Patvirtintos</div>
            <div className="text-3xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Laukiančios</div>
            <div className="text-3xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  ←
                </button>
                <button
                  onClick={nextMonth}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells before first day */}
              {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentYear, currentMonth, day);
                const dayBookings = getBookingsForDate(date);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-2 ${
                      isToday
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {day}
                    </div>
                    {dayBookings.length > 0 && (
                      <div className="space-y-1">
                        {dayBookings.slice(0, 2).map((booking) => (
                          <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className={`text-xs px-1 py-0.5 rounded cursor-pointer ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {formatTime(new Date(booking.startTime))}
                          </div>
                        ))}
                        {dayBookings.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayBookings.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Bookings List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Artimiausi rezervacijos
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {bookings
              .filter((b) => new Date(b.startTime) >= new Date())
              .slice(0, 5)
              .map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {booking.clientName}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        📅 {formatDate(new Date(booking.startTime))} •{" "}
                        {formatTime(new Date(booking.startTime))} -{" "}
                        {formatTime(new Date(booking.endTime))}
                      </div>
                      <div className="text-sm text-gray-600">
                        📞 {booking.clientPhone} • ✉️ {booking.clientEmail}
                      </div>
                      {booking.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          📝 {booking.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Patvirtinta"
                          : booking.status === "pending"
                            ? "Laukiama"
                            : "Atšaukta"}
                      </span>
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          Atšaukti
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {bookings.filter((b) => new Date(b.startTime) >= new Date())
              .length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Nėra artimų rezervacijų
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Rezervacijos detalės</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Klientas</div>
                <div className="font-semibold">{selectedBooking.clientName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Telefonas</div>
                <div>{selectedBooking.clientPhone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">El. paštas</div>
                <div>{selectedBooking.clientEmail}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Laikas</div>
                <div>
                  {formatDate(new Date(selectedBooking.startTime))} •{" "}
                  {formatTime(new Date(selectedBooking.startTime))} -{" "}
                  {formatTime(new Date(selectedBooking.endTime))}
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <div className="text-sm text-gray-600">Pastabos</div>
                  <div>{selectedBooking.notes}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600">Būsena</div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedBooking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : selectedBooking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedBooking.status === "confirmed"
                    ? "Patvirtinta"
                    : selectedBooking.status === "pending"
                      ? "Laukiama"
                      : "Atšaukta"}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {selectedBooking.status !== "cancelled" && (
                <button
                  onClick={() => {
                    handleCancelBooking(selectedBooking.id);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Atšaukti rezervaciją
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Uždaryti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
