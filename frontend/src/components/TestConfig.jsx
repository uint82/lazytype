import { useState, useEffect } from "react";
import { getQuoteGroups } from "../controllers/quotes-controller";
import GroupModal from "./GroupModal";

const TestConfig = ({ selectedGroup, setSelectedGroup }) => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  useEffect(() => {
    const loadedGroups = getQuoteGroups();
    setGroups(loadedGroups);

    const handleResize = () => {
      setIsCompactView(window.innerWidth < 720);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (groupIndex) => {
    setSelectedGroup(groupIndex);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {!isCompactView ? (
        groups.map((group) => (
          <button
            key={group.index ?? "all"}
            onClick={() => handleSelect(group.index)}
            className={`px-4 py-2 rounded transition-all ${selectedGroup === group.index
                ? "bg-[#D8AB19] text-[#282828]"
                : "bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]"
              }`}
          >
            {group.label}
          </button>
        ))
      ) : (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945] transition-all"
          >
            Test Configuration ▼
          </button>

          {isModalOpen && (
            <GroupModal
              groups={groups}
              selectedGroup={selectedGroup}
              onSelect={handleSelect}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TestConfig;
