import HelloHeader from "./hello-header";
import TestHeader from "./test-header";

export default function StepHeader({ step }) {
    if (step === "intro") {
        return <HelloHeader title="Тестирование" />;
    }
    // Можно менять title для test-header на каждом шаге, если надо
    if (step === "question") {
        return <TestHeader title="Тестирование" />;
    }
    if (step === "finish") {
        return <TestHeader title="Тестирование" />;
    }
    return null;
}
