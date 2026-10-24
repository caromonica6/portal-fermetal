"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Phone, 
  Cake, 
  MessageSquare, 
  Send, 
  Users, 
  ShieldAlert 
} from "lucide-react";

// Lista de cumpleañeros
const CUMPLEANEROS = [
  { nombre: "Pedro Pérez", cargo: "Almacén", dia: 5, mes: "Noviembre" },
  { nombre: "Mónica", cargo: "Recursos Humanos", dia: 6, mes: "Noviembre" },
  { nombre: "María Rodríguez", cargo: "Ventas", dia: 12, mes: "Noviembre" },
  { nombre: "Carlos Gómez", cargo: "Administración", dia: 24, mes: "Noviembre" },
];

export default function PortalFermetal() {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "¡Hola! Bienvenido al Portal Fermetal. ¿En qué te puedo ayudar hoy? Selecciona una opción del menú rápido o escribe tu duda." }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [nextPayDate, setNextPayDate] = useState("");

  useEffect(() => {
    const calculateNextPay = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();

      const payDates = [14, 29].map((day) => {
        let date = new Date(year, month, day);
        if (date.getDay() === 6) date.setDate(day - 1);
        if (date.getDay() === 0) date.setDate(day - 2);
        return date;
      });

      let next = payDates.find((d) => d >= today);
      if (!next) {
        let nextMonthDate = new Date(year, month + 1, 14);
        if (nextMonthDate.getDay() === 6) nextMonthDate.setDate(13);
        if (nextMonthDate.getDay() === 0) nextMonthDate.setDate(12);
        next = nextMonthDate;
      }

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      setNextPayDate(next.toLocaleDateString('es-ES', options));
    };

    calculateNextPay();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleOpenCumpleanos = () => {
    setModalOpen("cumpleanos");
    triggerConfetti();
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const newMessages = [...chatMessages, { sender: "user", text: query }];
    setChatMessages(newMessages);
    if (!textToSend) setInputMsg("");

    setTimeout(() => {
      let botResponse = "Para más información detallada, por favor acude a la oficina de RRHH en el horario de atención (Lunes a Jueves de 2:00 PM a 3:00 PM).";
      const q = query.toLowerCase();

      if (q.includes("constancia")) {
        botResponse = "Para solicitar tu constancia de trabajo, haz clic en el botón 'Solicitar Constancia' en el menú de arriba para enviarnos tus datos por WhatsApp.";
      } else if (q.includes("horario") || q.includes("jornada")) {
        botResponse = "Nuestra jornada laboral es de Lunes a Viernes de 7:00 AM a 4:00 PM, con 1 hora de almuerzo.";
      } else if (q.includes("pago") || q.includes("nomina") || q.includes("quincena")) {
        botResponse = `Las fechas fijas de pago son los días 14 y 29 de cada mes (o el viernes hábil anterior si cae fin de semana). Próxima fecha: ${nextPayDate}.`;
      } else if (q.includes("directorio") || q.includes("extension")) {
        botResponse = "Puedes consultar el directorio de extensiones internas presionando el botón 'Directorio' en la barra superior.";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      <header className="bg-blue-900 text-white py-6 px-4 shadow-md text-center">
        <h1 className="text-3xl font-bold tracking-wide">PORTAL FERMETAL</h1>
        <p className="text-sm text-blue-200 mt-1">Gestión Humana — Asistente Integral para el Colaborador</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 text-white p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Próxima Fecha de Pago</p>
              <p className="text-lg font-bold text-slate-800 capitalize">{nextPayDate || "Cargando..."}</p>
            </div>
          </div>
          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
            Ajuste días hábiles activo
          </span>
        </div>

        <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-sm">Asistente Fermetal</span>
            </div>
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">En línea</span>
          </div>

          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Accesos Rápidos:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button 
                onClick={() => setModalOpen("constancia")}
                className="flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 p-2.5 rounded-lg text-xs font-medium transition shadow-sm"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Solicitar Constancia</span>
              </button>

              <button 
                onClick={handleOpenCumpleanos}
                className="flex items-center space-x-2 bg-white hover:bg-orange-50 text-orange-900 border border-orange-200 p-2.5 rounded-lg text-xs font-medium transition shadow-sm"
              >
                <Cake className="w-4 h-4 text-orange-500" />
                <span>Cumpleañeros</span>
              </button>

              <button 
                onClick={() => handleSendMessage("¿Cuál es el directorio de extensiones?")}
                className="flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 p-2.5 rounded-lg text-xs font-medium transition shadow-sm"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Directorio</span>
              </button>

              <button 
                onClick={() => handleSendMessage("¿Cuáles son las fechas de pago?")}
                className="flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 p-2.5 rounded-lg text-xs font-medium transition shadow-sm"
              >
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Horarios y Pagos</span>
              </button>
            </div>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-3 bg-white">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-blue-900 text-white rounded-br-none" 
                      : "bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
            <input 
              type="text" 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-900" />
            <span>Información Institucional y Normativas</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <h3>Jornada Laboral y Horarios</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                De Lunes a Viernes de 7:00 AM a 4:00 PM, con 1 hora de descanso para el almuerzo.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <h3>Asistencia y Notificación de Reposos</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notificar ausencias antes de las 8:00 AM. Los reposos médicos deben presentarse formalmente en RRHH dentro de las 48 horas siguientes.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
                <Calendar className="w-4 h-4" />
                <h3>Vacaciones y Beneficios</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solicitud con 15 días hábiles de anticipación. Pago de nómina los días 14 y 29 de cada mes y depósito de Cesta Ticket.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
                <Phone className="w-4 h-4" />
                <h3>Atención Presencial de RRHH</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oficina disponible para atención presencial y trámites de Lunes a Jueves de 2:00 PM a 3:00 PM.
              </p>
            </div>
          </div>
        </section>
      </main>

      {modalOpen === "constancia" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Solicitar Constancia de Trabajo</h3>
            <div className="text-xs text-slate-600 space-y-2 text-left bg-slate-50 p-3 rounded-lg">
              <p>• <strong>Tiempo de entrega:</strong> 24 a 48 horas hábiles.</p>
              <p>• <strong>Datos requeridos:</strong> Nombre, Cédula de Identidad y si la requiere con o sin sueldo.</p>
            </div>
            <a 
              href="https://wa.me/584241465606?text=Hola%20RRHH,%20deseo%20solicitar%20una%20constancia%20de%20trabajo.%20Nombre:%20%20%7C%20C%C3%A9dula:%20%20%7C%20Tipo:%20(Con/Sin%20Sueldo)" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md"
            >
              📱 Enviar solicitud por WhatsApp
            </a>
            <button 
              onClick={() => setModalOpen(null)}
              className="text-xs text-slate-400 underline block mx-auto pt-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {modalOpen === "cumpleanos" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-xl">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Cake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">🎉 Cumpleañeros del Mes</h3>
            <div className="space-y-2 text-left max-h-48 overflow-y-auto pr-1">
              {CUMPLEANEROS.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-orange-50 p-2.5 rounded-lg border border-orange-100 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{c.nombre}</p>
                    <p className="text-slate-500 text-[10px]">{c.cargo}</p>
                  </div>
                  <span className="font-semibold text-orange-600">{c.dia} de {c.mes}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setModalOpen(null)}
              className="w-full bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
