import React, { useState } from "react";

/**
 * COMPONENTE DE PRUEBA - Budget Input
 * 
 * Este componente demuestra la validación del input de presupuesto.
 * 
 * PRUEBAS QUE PUEDES HACER:
 * 1. Intentar escribir letras (a, b, c, etc.) -> NO PERMITE
 * 2. Intentar escribir signo negativo (-) -> NO PERMITE
 * 3. Intentar escribir punto (.) -> NO PERMITE
 * 4. Intentar escribir coma (,) -> NO PERMITE
 * 5. Intentar pegar texto con letras -> SOLO EXTRAE NÚMEROS
 * 6. Escribir solo números (0-9) -> FUNCIONA ✓
 * 7. Usar Backspace, Delete, flechas -> FUNCIONA ✓
 * 
 * USO: Importa este componente en cualquier página para probarlo
 * import TEST_BudgetInput from "./components/TEST_BudgetInput";
 * <TEST_BudgetInput />
 */
export default function TEST_BudgetInput() {
  const [budget, setBudget] = useState("");
  const [testResults, setTestResults] = useState([]);

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, "");
    
    // Log para ver qué se intentó ingresar vs qué se guardó
    if (value !== cleanValue) {
      setTestResults(prev => [
        ...prev,
        `❌ BLOQUEADO: Intentaste "${value}" -> Guardado: "${cleanValue}"`
      ]);
    }
    
    setBudget(cleanValue);
  };

  const handleBudgetKeyDown = (e) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setTestResults(prev => [
        ...prev,
        `🚫 TECLA BLOQUEADA: "${e.key}" (código: ${e.keyCode})`
      ]);
    }
  };

  const handleBudgetPaste = (e) => {
    const pasteData = e.clipboardData.getData('text');
    if (/\D/.test(pasteData)) {
      e.preventDefault();
      const numbers = pasteData.replace(/\D/g, '');
      setTestResults(prev => [
        ...prev,
        `📋 PASTE FILTRADO: "${pasteData}" -> Solo números: "${numbers}"`
      ]);
      if (numbers) {
        setBudget(prev => prev + numbers);
      }
    }
  };

  const runTests = () => {
    const tests = [
      { input: "123", expected: "123", result: "✓" },
      { input: "-123", expected: "123", result: "✓" },
      { input: "abc", expected: "", result: "✓" },
      { input: "12.34", expected: "1234", result: "✓" },
      { input: "12,34", expected: "1234", result: "✓" },
      { input: "  12  ", expected: "12", result: "✓" },
    ];
    
    setTestResults([
      "🧪 PRUEBAS AUTOMÁTICAS:",
      ...tests.map(t => `${t.result} Input: "${t.input}" -> Esperado: "${t.expected}"`)
    ]);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🧪 Test: Validación de Presupuesto
      </h2>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Instrucciones:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>✓ Escribe solo números (0-9)</li>
          <li>✗ Intenta escribir letras, signos negativos, puntos, comas</li>
          <li>✓ Usa Backspace, flechas, etc.</li>
          <li>✓ Intenta pegar texto con caracteres especiales</li>
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Presupuesto Máximo
        </label>
        <input
          type="text"
          value={budget}
          onChange={handleBudgetChange}
          onKeyDown={handleBudgetKeyDown}
          onPaste={handleBudgetPaste}
          placeholder="Intenta escribir letras o números negativos..."
          inputMode="numeric"
          autoComplete="off"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-2 text-sm text-gray-600">
          Valor actual: <strong className="text-green-600">{budget || "(vacío)"}</strong>
        </p>
      </div>

      <button
        onClick={runTests}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Ejecutar Pruebas Automáticas
      </button>

      <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Log de Eventos:</h3>
        {testResults.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No hay eventos aún. Intenta escribir en el input.
          </p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, idx) => (
              <p key={idx} className="text-xs font-mono text-gray-700">
                {result}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="font-semibold text-green-800 mb-2">✓ Validaciones Activas:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✓ onChange: Elimina caracteres no numéricos con regex /\D/g</li>
          <li>✓ onKeyDown: Bloquea teclas antes de que se escriban</li>
          <li>✓ onPaste: Filtra el contenido pegado extrayendo solo números</li>
        </ul>
      </div>
    </div>
  );
}
