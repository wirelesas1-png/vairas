"use client";

import { useState } from "react";
import { formatDate, getMonthNames, isSameDay } from "@/lib/date-utils";

interface WorkingHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean | null;
}

interface BlockedDate {
  startDate: string;
  endDate: string;
}

interface ExistingBooking {
  startTime: string;
  endTime: string;
}

interface Instructor {
  id: number;
  name: string;
  bio: string | null;
  profileImage: string | null;
  phone: string | null;
}

interface Props {
  instructor: Instructor;
  lessonDuration: number;
  workingHours: WorkingHour[];
  blockedDates: BlockedDate[];
  existingBookings: ExistingBooking[];
}

export default function BookingClient({
  instructor,
  lessonDuration,
  workingHours,
  blockedDates,
  existingBookings,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Generate available dates for the next 30 days
  const getAvailableDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();

      // Check if instructor works on this day
      const hasWorkingHours = workingHours.some(
        (wh) => wh.dayOfWeek === dayOfWeek && wh.isActive
      );

      if (!hasWorkingHours) continue;

      // Check if date is blocked
      const isBlocked = blockedDates.some((bd) => {
        const start = new Date(bd.startDate);
        const end = new Date(bd.endDate);
        return date >= start && date <= end;
      });

      if (!isBlocked) {
        dates.push(date);
      }
    }

    return dates;
  };

  // Generate available time slots for selected date
  const getAvailableTimeSlots = (date: Date) => {
    if (!date) return [];

    const dayOfWeek = date.getDay();
    const dayWorkingHours = workingHours.filter(
      (wh) => wh.dayOfWeek === dayOfWeek && wh.isActive
    );

    if (dayWorkingHours.length === 0) return [];

    const slots: string[] = [];

    dayWorkingHours.forEach((wh) => {
      const [startHour, startMinute] = wh.startTime.split(":").map(Number);
      const [endHour, endMinute] = wh.endTime.split(":").map(Number);

      let currentTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      while (currentTime + lessonDuration <= endTime) {
        const hour = Math.floor(currentTime / 60);
        const minute = currentTime % 60;
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        // Check if this slot is already booked
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + lessonDuration);

        const isBooked = existingBookings.some((booking) => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(booking.endTime);
          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          );
        });

        if (!isBooked) {
          slots.push(timeString);
        }

        currentTime += lessonDuration;
      }
    });

    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedDate || !selectedTime) {
      setError("Pasirinkite datą ir laiką");
      return;
    }

    setLoading(true);

    try {
      const [hour, minute] = selectedTime.split(":").map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + lessonDuration);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructorId: instructor.id,
          clientName: formData.name,
          clientPhone: formData.phone,
          clientEmail: formData.email,
          notes: formData.notes,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Įvyko klaida");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", notes: "" });
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (err) {
      setError("Įvyko klaida. Bandykite dar kartą.");
      setLoading(false);
    }
  };

  const availableDates = getAvailableDates();
  const availableTimeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Rezervacija sėkminga!
          </h1>
          <p className="text-gray-600 mb-6">
            Jūsų rezervacija buvo sėkmingai užregistruota. Instruktorius susisieks su jumis artimiausiu metu.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Patvirtinimo laiškas išsiųstas į {formData.email}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Rezervuoti dar kartą
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Instructor Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-6">
            {instructor.profileImage ? (
              <img
                src={instructor.profileImage}
                alt={instructor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                {instructor.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {instructor.name}
              </h1>
              {instructor.bio && (
                <p className="text-gray-600 mb-4">{instructor.bio}</p>
              )}
              {instructor.phone && (
                <p className="text-gray-600">📞 {instructor.phone}</p>
              )}
              <div className="mt-4 inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                Pamokos trukmė: {lessonDuration} min
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Rezervuoti pamoką
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pasirinkite datą
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {availableDates.slice(0, 12).map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedDate && isSameDay(selectedDate, date)
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      {date.toLocaleDateString("lt-LT", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold">
                      {date.toLocaleDateString("lt-LT", { day: "numeric" })}
                    </div>
                    <div className="text-xs text-gray-600">
                      {date.toLocaleDateString("lt-LT", { month: "short" })}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pasirinkite laiką
                </label>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 font-semibold transition ${
                          selectedTime === time
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Šią dieną nėra laisvų laikų
                  </p>
                )}
              </div>
            )}

            {/* Contact Info */}
            {selectedTime && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Vardas ir pavardė *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jonas Jonaitis"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Telefono numeris *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+370 600 00000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    El. paštas *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jonas@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pastabos (neprivaloma)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Papildoma informacija..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? "Rezervuojama..." : "Rezervuoti"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
