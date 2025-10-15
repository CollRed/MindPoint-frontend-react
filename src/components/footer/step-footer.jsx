import Footer from "./footer.jsx";
import TestFooter from "./test-footer.jsx";

export default function StepFooter({ step }) {
    if (step === "intro") {
        return <Footer />;
    }

    if (step === "question") {
        return <TestFooter />;
    }
    if (step === "finish") {
        return <Footer />;
    }
    return null;
}