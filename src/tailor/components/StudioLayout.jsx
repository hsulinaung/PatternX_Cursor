import PageContainer from "../../shared/components/PageContainer";
import StudioNav from "./StudioNav";
import "../tailor.css";

export default function StudioLayout({ children }) {
  return (
    <PageContainer className="studio">
      <div className="studio__grid">
        <StudioNav />
        <div className="studio__main">{children}</div>
      </div>
    </PageContainer>
  );
}
