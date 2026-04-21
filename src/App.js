import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardList,
  Bell,
  Search,
  LogOut,
  Calendar,
  Lock,
  Mail,
  Info,
  History,
  AlertTriangle,
  ChevronDown,
  Send,
  Loader2,
  Wifi,
  Trash2,
  Phone,
  BarChart3,
  Download,
  Database,
} from "lucide-react";

// --- Datos de Ejemplo para Carga Inicial ---
const SAMPLE_REQUESTS = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    tipoIdentificacion: "DNI",
    numeroIdentificacion: "12345678",
    identificacion: "DNI: 12345678",
    email: "juan.perez@email.com",
    numeroTelefono: "2494123456",
    especialidad: "Cardiología",
    fechaTurno: "2025-10-15",
    motivo: "Viaje imprevisto por trabajo",
    status: "pendiente",
    ausencias: 0,
    cancelaciones: 1,
    timestamp: Date.now() - 1000000,
  },
  {
    id: "2",
    nombre: "María",
    apellido: "González",
    tipoIdentificacion: "HC",
    numeroIdentificacion: "998877",
    identificacion: "HC: 998877",
    email: "maria.g@email.com",
    numeroTelefono: "2494987654",
    especialidad: "Traumatología",
    fechaTurno: "2025-10-10",
    motivo: "Ya me siento mejor, gracias.",
    status: "procesado",
    ausencias: 2,
    cancelaciones: 3,
    timestamp: Date.now() - 5000000,
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    tipoIdentificacion: "DNI",
    numeroIdentificacion: "45678901",
    identificacion: "DNI: 45678901",
    email: "",
    numeroTelefono: "2494112233",
    especialidad: "Pediatría",
    fechaTurno: "2025-10-20",
    motivo: "Superposición con horario escolar",
    status: "pendiente",
    ausencias: 0,
    cancelaciones: 0,
    timestamp: Date.now(),
  },
];

// --- Componentes UI ---

const SvgLogo = ({ className }) => (
  <div
    className={`flex items-center gap-3 select-none ${
      className === "h-12" ? "" : "scale-90 origin-left"
    }`}
  >
    <div className="relative flex items-center justify-center w-10 h-10 bg-[#343a90] rounded-lg shadow-sm text-white overflow-hidden">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="w-6 h-6 z-10"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-white/20 rounded-tr-full"></div>
    </div>
    <div className="flex flex-col justify-center h-full">
      <span className="font-bold text-xl leading-none text-[#343a90] tracking-tight font-sans">
        SISP
      </span>
      <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-tight">
        Salud Pública
      </span>
    </div>
  </div>
);

const Logo = ({ className = "h-12" }) => {
  const [imgError, setImgError] = useState(false);
  if (imgError) return <SvgLogo className={className} />;
  return (
    <img
      src="logo sisp (1).png"
      alt="Logo SISP"
      className={`${className} object-contain`}
      onError={() => setImgError(true)}
    />
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-slate-100 ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#343a90] text-white hover:bg-[#2a2f75] shadow-[#343a90]/30 shadow-md",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 shadow-md",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 shadow-red-200 shadow-md",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const InputGroup = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-slate-700 ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <input
        className={`block w-full ${
          Icon ? "pl-10" : "pl-3"
        } pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#343a90] focus:border-[#343a90] transition-colors sm:text-sm`}
        {...props}
      />
    </div>
  </div>
);

const Badge = ({ status }) => {
  const currentStatus = typeof status === "string" ? status : "pendiente";

  const styles = {
    pendiente: "bg-amber-100 text-amber-800 border-amber-200",
    procesado: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  const icons = {
    pendiente: <AlertCircle className="w-3 h-3" />,
    procesado: <CheckCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${
        styles[currentStatus] || styles.pendiente
      }`}
    >
      {icons[currentStatus] || icons.pendiente}
      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
    </span>
  );
};

// --- Componente de Notificación ---
const ToastNotification = ({ notification, onClose }) => {
  if (!notification) return null;
  const isError = notification.type === "error";
  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div
        className={`px-6 py-4 rounded-lg shadow-xl flex items-start gap-3 max-w-md border ${
          isError
            ? "bg-red-50 border-red-100 text-red-800"
            : "bg-emerald-600 border-emerald-700 text-white"
        }`}
      >
        <div className="mt-0.5">
          {isError ? (
            <AlertTriangle className="w-6 h-6 text-red-600" />
          ) : (
            <CheckCircle className="w-6 h-6 text-emerald-100" />
          )}
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1">
            {isError ? "Atención" : "Sistema Actualizado"}
          </h4>
          <p
            className={`text-sm leading-tight ${
              isError ? "text-red-700" : "text-emerald-100"
            }`}
          >
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-auto ${
            isError
              ? "text-red-400 hover:text-red-600"
              : "text-emerald-200 hover:text-white"
          }`}
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- Componente Modal de Confirmación ---
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  request,
  processing,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-inner mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            ¿Confirmar Baja de Turno?
          </h3>
          <p className="text-slate-500 text-sm mt-2 text-center max-w-xs">
            Esta acción enviará una notificación automática por{" "}
            <b>SMS/WhatsApp</b> al paciente.
          </p>
        </div>

        <div className="p-6 bg-white">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm shadow-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Paciente:</span>
              <span className="font-bold text-slate-800 text-right">
                {String(request.apellido || "")}, {String(request.nombre || "")}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">
                Identificación:
              </span>
              <span className="text-slate-700 text-right font-mono">
                {String(request.identificacion || "")}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Teléfono:</span>
              <span className="text-slate-700 text-right font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {String(request.numeroTelefono || "")}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Fecha Turno:</span>
              <span className="text-slate-700 text-right font-medium">
                {request.fechaTurno
                  ? new Date(
                      request.fechaTurno + "T12:00:00"
                    ).toLocaleDateString()
                  : "--"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-medium shrink-0">
                Motivo:
              </span>
              <span className="text-slate-700 text-right italic ml-4 break-words max-w-[200px]">
                {String(request.motivo || "No especificado")}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirmar Baja
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Componente Modal de Informes ---
const ReportModal = ({ isOpen, onClose, requests }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);

  if (!isOpen) return null;

  const generateReport = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = requests.filter((r) => {
      if (!r.fechaTurno) return false;
      const turnoDate = new Date(r.fechaTurno + "T12:00:00");
      return turnoDate >= start && turnoDate <= end;
    });

    const total = filtered.length;
    const processed = filtered.filter((r) => r.status === "procesado").length;
    const pending = filtered.filter((r) => r.status === "pendiente").length;

    const bySpecialty = filtered.reduce((acc, curr) => {
      const spec = String(curr.especialidad || "Sin especialidad");
      acc[spec] = (acc[spec] || 0) + 1;
      return acc;
    }, {});

    setReportData({
      total,
      processed,
      pending,
      bySpecialty,
      range: `${new Date(startDate).toLocaleDateString()} al ${new Date(
        endDate
      ).toLocaleDateString()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-[#343a90]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Generar Informe de Bajas
              </h3>
              <p className="text-sm text-slate-500">
                Selecciona un rango de fechas de turnos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#343a90]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#343a90]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={generateReport} className="h-[42px]">
              Analizar
            </Button>
          </div>

          {reportData ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-800">
                  Resumen del Periodo
                </h4>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {reportData.range}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                  <span className="text-3xl font-bold text-blue-700 block">
                    {reportData.total}
                  </span>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    Total Solicitudes
                  </span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                  <span className="text-3xl font-bold text-emerald-700 block">
                    {reportData.processed}
                  </span>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">
                    Procesadas
                  </span>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                  <span className="text-3xl font-bold text-amber-700 block">
                    {reportData.pending}
                  </span>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">
                    Pendientes
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm">
                  Desglose por Especialidad
                </h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">
                          Especialidad
                        </th>
                        <th className="px-4 py-2 text-right font-medium">
                          Cantidad
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(reportData.bySpecialty).length > 0 ? (
                        Object.entries(reportData.bySpecialty).map(
                          ([spec, count]) => (
                            <tr key={spec}>
                              <td className="px-4 py-2 text-slate-700">
                                {spec}
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-slate-900">
                                {count}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-4 py-4 text-center text-slate-400 italic"
                          >
                            Sin datos para este periodo
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Selecciona un rango de fechas para ver las estadísticas</p>
            </div>
          )}
        </div>

        {reportData && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <Button
              variant="secondary"
              onClick={() =>
                alert(
                  "Función de descarga simulada: Se generaría un PDF/Excel con estos datos."
                )
              }
            >
              <Download className="w-4 h-4" />
              Exportar Datos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Vistas Principales ---

const PatientView = ({ onSubmitRequest, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoIdentificacion: "DNI",
    numeroIdentificacion: "",
    email: "",
    numeroTelefono: "",
    especialidad: "",
    fechaTurno: "",
    motivo: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullRequest = {
      ...formData,
      identificacion: `${formData.tipoIdentificacion}: ${formData.numeroIdentificacion}`,
    };

    const success = await onSubmitRequest(fullRequest);

    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          nombre: "",
          apellido: "",
          tipoIdentificacion: "DNI",
          numeroIdentificacion: "",
          email: "",
          numeroTelefono: "",
          especialidad: "",
          fechaTurno: "",
          motivo: "",
        });
      }, 4000);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-8 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          ¡Solicitud Enviada!
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Hemos recibido tu solicitud. Te enviaremos la confirmación a tu número
          de teléfono registrado.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Cancelación de Turnos
        </h1>
        <p className="text-slate-600">
          Completa el formulario para solicitar la cancelación de tu turno
          médico.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Nombre"
              placeholder="Ej: Juan"
              icon={User}
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <InputGroup
              label="Apellido"
              placeholder="Ej: Pérez"
              icon={User}
              required
              value={formData.apellido}
              onChange={(e) =>
                setFormData({ ...formData, apellido: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 ml-1">
                Identificación del Paciente
              </label>
              <div className="flex rounded-lg shadow-sm">
                <div className="relative">
                  <select
                    className="h-full pl-3 pr-8 py-2.5 bg-slate-100 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-[#343a90] focus:border-[#343a90] text-sm font-medium text-slate-700 appearance-none cursor-pointer outline-none"
                    value={formData.tipoIdentificacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoIdentificacion: e.target.value,
                      })
                    }
                  >
                    <option value="DNI">DNI</option>
                    <option value="HC">Historia Clínica</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {formData.tipoIdentificacion === "DNI" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <ClipboardList className="h-5 w-5" />
                    )}
                  </div>
                  <input
                    type={
                      formData.tipoIdentificacion === "DNI" ? "number" : "text"
                    }
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-l-0 border-slate-300 rounded-r-lg focus:ring-2 focus:ring-[#343a90] focus:border-[#343a90] transition-colors sm:text-sm"
                    placeholder={
                      formData.tipoIdentificacion === "DNI"
                        ? "Ingrese número de DNI"
                        : "Ingrese número de Historia Clínica"
                    }
                    required
                    value={formData.numeroIdentificacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroIdentificacion: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Número de Teléfono (Contacto)"
                placeholder="Ej: 249 444 5555"
                icon={Phone}
                type="tel"
                required
                value={formData.numeroTelefono}
                onChange={(e) =>
                  setFormData({ ...formData, numeroTelefono: e.target.value })
                }
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 ml-1">
                  Correo Electrónico{" "}
                  <span className="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#343a90] focus:border-[#343a90] transition-colors sm:text-sm"
                    placeholder="Ej: paciente@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 ml-1">
                Especialidad del Turno
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Activity className="h-5 w-5" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#343a90] focus:border-[#343a90] transition-colors sm:text-sm text-slate-700"
                  required
                  value={formData.especialidad}
                  onChange={(e) =>
                    setFormData({ ...formData, especialidad: e.target.value })
                  }
                >
                  <option value="">Seleccione una especialidad...</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Clínica Médica">Clínica Médica</option>
                  <option value="Dermatología">Dermatología</option>
                  <option value="Gastroenterología">Gastroenterología</option>
                  <option value="Ginecología">Ginecología</option>
                  <option value="Neumonología">Neumonología</option>
                  <option value="Neurología">Neurología</option>
                  <option value="Nutrición">Nutrición</option>
                  <option value="Odontología">Odontología</option>
                  <option value="Oftalmología">Oftalmología</option>
                  <option value="Otorrinolaringología">
                    Otorrinolaringología
                  </option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Reumatología">Reumatología</option>
                  <option value="Traumatología">Traumatología</option>
                  <option value="Trauma Columna">Trauma Columna</option>
                  <option value="Trauma General">Trauma General</option>
                  <option value="Trauma Miembro Inferior">
                    Trauma Miembro Inferior
                  </option>
                  <option value="Trauma Miembro Superior">
                    Trauma Miembro Superior
                  </option>
                  <option value="Trauma Rodilla">Trauma Rodilla</option>
                </select>
              </div>
            </div>

            <InputGroup
              label="Fecha del Turno a Cancelar"
              type="date"
              icon={Calendar}
              required
              value={formData.fechaTurno}
              onChange={(e) =>
                setFormData({ ...formData, fechaTurno: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 ml-1">
              Motivo de Cancelación{" "}
              <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                <FileText className="h-5 w-5" />
              </div>
              <textarea
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#343a90] focus:border-[#343a90] transition-colors sm:text-sm resize-none"
                placeholder="Breve descripción del motivo..."
                rows="2"
                value={formData.motivo}
                onChange={(e) =>
                  setFormData({ ...formData, motivo: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Solicitar Cancelación de Turno"
              )}
            </Button>
            <p className="text-xs text-center text-slate-500 mt-4">
              * Al enviar este formulario, declaras que los datos ingresados son
              correctos.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

// 2. Componente de Login para Personal
const LoginView = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (
        credentials.email === "admin@hospital.com" &&
        credentials.password === "admin123"
      ) {
        onLogin();
      } else {
        setError("Credenciales incorrectas. Verifique los datos de prueba.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo className="h-20" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Acceso Personal</h2>
          <p className="text-slate-500 text-sm mt-1">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        <div className="bg-[#343a90]/5 border border-[#343a90]/20 rounded-lg p-4 mb-6 text-sm text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-[#343a90] mb-2">
            <Info className="w-4 h-4" />
            <span>Datos de Acceso (Prototipo)</span>
          </div>
          <div className="space-y-1 ml-6">
            <p>
              Usuario:{" "}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 select-all">
                admin@hospital.com
              </span>
            </p>
            <p>
              Contraseña:{" "}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 select-all">
                admin123
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <InputGroup
            label="Correo Electrónico"
            placeholder="usuario@hospital.com"
            icon={Mail}
            type="email"
            required
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <InputGroup
            label="Contraseña"
            placeholder="••••••••"
            icon={Lock}
            type="password"
            required
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-2.5" disabled={loading}>
            {loading ? "Verificando..." : "Ingresar al Sistema"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// 3. Vista del Personal (Admin)
const StaffView = ({
  requests,
  onProcessRequest,
  onLogout,
  onLoadExamples,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [confirmingReq, setConfirmingReq] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Filtrar solicitudes
  const filteredRequests = requests
    .filter((req) => {
      const term = searchTerm.toLowerCase();
      const fechaTurnoLocal = req.fechaTurno
        ? new Date(req.fechaTurno + "T12:00:00").toLocaleDateString()
        : "";
      const fechaSolicitudLocal = req.timestamp
        ? new Date(req.timestamp).toLocaleDateString()
        : "";

      return (
        String(req.nombre || "")
          .toLowerCase()
          .includes(term) ||
        String(req.apellido || "")
          .toLowerCase()
          .includes(term) ||
        String(req.identificacion || "")
          .toLowerCase()
          .includes(term) ||
        String(req.especialidad || "")
          .toLowerCase()
          .includes(term) ||
        String(req.motivo || "")
          .toLowerCase()
          .includes(term) ||
        String(req.status || "")
          .toLowerCase()
          .includes(term) ||
        String(req.fechaTurno || "").includes(term) ||
        String(req.email || "")
          .toLowerCase()
          .includes(term) ||
        String(req.numeroTelefono || "").includes(term) ||
        fechaTurnoLocal.includes(term) ||
        fechaSolicitudLocal.includes(term)
      );
    })
    .sort((a, b) => {
      if (a.status === "pendiente" && b.status !== "pendiente") return -1;
      if (a.status !== "pendiente" && b.status === "pendiente") return 1;
      return (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0);
    });

  const handleProcess = () => {
    if (!confirmingReq) return;
    setProcessingId(confirmingReq.id);

    onProcessRequest(confirmingReq.id, confirmingReq.numeroTelefono).then(
      () => {
        setProcessingId(null);
        setConfirmingReq(null);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Modales */}
      <ConfirmationModal
        isOpen={!!confirmingReq}
        onClose={() => setConfirmingReq(null)}
        onConfirm={handleProcess}
        request={confirmingReq}
        processing={processingId !== null}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        requests={requests}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Logo className="h-10 w-auto" />
            <div className="h-8 w-px bg-slate-300 mx-1 hidden sm:block"></div>
            <h1 className="text-2xl font-bold text-slate-800">
              Panel de Administración
            </h1>

            <div className="hidden sm:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-100 ml-4 animate-in fade-in zoom-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              En Vivo (Local)
            </div>
          </div>
          <p className="text-slate-500 ml-1">
            Gestión de cancelaciones y bajas de turnos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex gap-4 text-sm">
            <div className="text-center">
              <span className="block font-bold text-2xl text-amber-500">
                {requests.filter((r) => r.status === "pendiente").length}
              </span>
              <span className="text-slate-500">Pendientes</span>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div className="text-center">
              <span className="block font-bold text-2xl text-emerald-600">
                {requests.filter((r) => r.status === "procesado").length}
              </span>
              <span className="text-slate-500">Procesados</span>
            </div>
          </div>

          <Button variant="secondary" onClick={onLogout} className="h-full">
            <LogOut className="w-4 h-4" /> Salir
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar con Buscador, Reporte y Carga de Ejemplos */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por DNI, Nombre, Teléfono, Fecha, Especialidad..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#343a90] focus:border-[#343a90]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto flex gap-2">
            <Button
              variant="secondary"
              onClick={onLoadExamples}
              className="w-full justify-center bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <Database className="w-4 h-4" />
              Cargar Ejemplos
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowReportModal(true)}
              className="w-full justify-center"
            >
              <BarChart3 className="w-4 h-4" />
              Generar Informe
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Paciente</th>
                <th className="px-6 py-3">Identificación</th>
                <th className="px-6 py-3">Especialidad</th>
                <th className="px-6 py-3">Fecha Turno</th>
                <th className="px-6 py-3">Motivo</th>
                <th className="px-6 py-3">Fecha Solicitud</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div>
                        {String(req.apellido || "")}, {String(req.nombre || "")}
                      </div>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-normal">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span
                            className="truncate max-w-[140px]"
                            title={String(req.numeroTelefono || "")}
                          >
                            {String(req.numeroTelefono || "")}
                          </span>
                        </div>
                        {req.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-normal">
                            <Mail className="w-3 h-3" />
                            <span
                              className="truncate max-w-[140px]"
                              title={String(req.email)}
                            >
                              {String(req.email)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-normal">
                          <History className="w-3 h-3 text-slate-400" />
                          <span>
                            Cancelaciones:{" "}
                            <b>{Number(req.cancelaciones || 0)}</b>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-sm">
                          {String(req.identificacion || "")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#343a90]/10 text-[#343a90] font-medium text-xs">
                        <Activity className="w-3 h-3" />
                        {String(req.especialidad || "")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {req.fechaTurno ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(
                            req.fechaTurno + "T12:00:00"
                          ).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <span
                        className="truncate block text-slate-600 italic"
                        title={String(req.motivo || "Sin motivo especificado")}
                      >
                        {String(req.motivo || "--")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {req.timestamp
                        ? new Date(req.timestamp).toLocaleDateString()
                        : "--"}{" "}
                      <br />
                      {req.timestamp
                        ? new Date(req.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === "pendiente" ? (
                        <Button
                          variant="primary"
                          className="ml-auto text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-900 shadow-none border-0"
                          onClick={() => setConfirmingReq(req)}
                        >
                          <>
                            <span>Cargar baja</span>
                            <CheckCircle className="w-3 h-3" />
                          </>
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
                          <Bell className="w-3 h-3" /> Notificado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p>
                        No se encontraron solicitudes.{" "}
                        {!requests.length &&
                          "Usa el botón 'Cargar Ejemplos' para añadir datos de prueba."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Componente Principal ---

export default function App() {
  const [currentView, setCurrentView] = useState("patient");
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [requests, setRequests] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para cargar datos de ejemplo localmente
  const handleLoadExamples = async () => {
    setRequests([
      ...requests,
      ...SAMPLE_REQUESTS.map((req) => ({
        ...req,
        id: Math.random().toString(36).substr(2, 9),
      })),
    ]);
    setNotification({
      type: "success",
      message: "Datos de prueba cargados correctamente en el prototipo.",
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Manejar nueva solicitud del paciente (Guardar Local)
  const handleNewRequest = async (data) => {
    setIsSubmitting(true);

    // Validación de duplicados
    const isDuplicate = requests.some(
      (req) =>
        req.identificacion === data.identificacion &&
        req.fechaTurno === data.fechaTurno &&
        req.especialidad === data.especialidad
    );

    if (isDuplicate) {
      setNotification({
        type: "error",
        message:
          "¡Atención! Ya existe una solicitud registrada para este turno.",
      });
      setTimeout(() => setNotification(null), 6000);
      setIsSubmitting(false);
      return false;
    }

    // Simular guardado local
    setTimeout(() => {
      const newRequest = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        status: "pendiente",
        ausencias: Math.floor(Math.random() * 3),
        cancelaciones: Math.floor(Math.random() * 5),
      };

      setRequests([newRequest, ...requests]);
      setIsSubmitting(false);
    }, 1000);

    return true;
  };

  // Manejar procesamiento por parte del staff (Local)
  const handleProcessRequest = async (id, phone) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "procesado" } : req
      )
    );

    console.log(`[SIMULACIÓN SMS] Enviando mensaje a: ${phone}`);

    setNotification({
      type: "success",
      message: `Baja cargada. Se envió un SMS/WhatsApp a ${phone}: "Cancelación de turno exitosa"`,
    });

    setTimeout(() => setNotification(null), 8000);
  };

  const handleStaffLogin = () => {
    setIsStaffAuthenticated(true);
  };

  const handleStaffLogout = () => {
    setIsStaffAuthenticated(false);
    setCurrentView("patient");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#343a90]/20">
      <ToastNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="hidden md:block w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col justify-center">
                <span className="text-slate-800 text-lg font-bold leading-tight tracking-tight">
                  Hospital Ramón Santamarina
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  Consultorios Externos (Prototipo)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-1 rounded-lg flex items-center text-sm font-medium border border-slate-200">
                <button
                  onClick={() => setCurrentView("patient")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    currentView === "patient"
                      ? "bg-white text-[#343a90] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Paciente
                </button>
                <button
                  onClick={() => setCurrentView("staff")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    currentView === "staff"
                      ? "bg-white text-[#343a90] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Personal
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-500">
        {currentView === "patient" ? (
          <PatientView
            onSubmitRequest={handleNewRequest}
            isSubmitting={isSubmitting}
          />
        ) : !isStaffAuthenticated ? (
          <LoginView onLogin={handleStaffLogin} />
        ) : (
          <StaffView
            requests={requests}
            onProcessRequest={handleProcessRequest}
            onLogout={handleStaffLogout}
            onLoadExamples={handleLoadExamples}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>
            © {new Date().getFullYear()} Hospital Ramón Santamarina - Sistema
            Integrado de Salud Pública.
          </p>
        </div>
      </footer>
    </div>
  );
}
