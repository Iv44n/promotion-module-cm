import { useState } from "react";
import { PromotionsDashboard } from "@/components/dashboard/PromotionsDashboard";
import { PromotionWizard } from "@/components/wizard/PromotionWizard";
import { WizardProvider } from "@/context/WizardContext";

const Index = () => {
	const [showWizard, setShowWizard] = useState(false);

	if (showWizard) {
		return (
			<WizardProvider>
				<PromotionWizard onBack={() => setShowWizard(false)} />
			</WizardProvider>
		);
	}

	return <PromotionsDashboard onNewPromotion={() => setShowWizard(true)} />;
};

export default Index;
