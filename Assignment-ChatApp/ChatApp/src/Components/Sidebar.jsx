import TeamMembersList from "./TeamMembersList";
import RecentChatsList from "./RecentChatsList";
import SearchBox from "./SearchBox";

const Sidebar = ({
  sidebarActive,
  setSidebarActive,
  searchQuery,
  setSearchQuery,
  filteredAndSortedTeamMembers,
  recentChats,
  loading,
  error,
  handleMemberClick,
}) => {
  return (
    <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
      {sidebarActive && (
        <box-icon
          name="x"
          onClick={() => setSidebarActive(!sidebarActive)}
        ></box-icon>
      )}
      <h2 className="app-title">Chatter</h2>

      {/* Search Box */}
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Team Members Section */}
      <h3>Team Members</h3>
      <TeamMembersList
        loading={loading}
        error={error}
        teamMembers={filteredAndSortedTeamMembers}
        handleMemberClick={handleMemberClick}
      />

      {/* Recent Chats Section */}
      <h3>Recent Chats</h3>
      <RecentChatsList
        recentChats={recentChats}
        handleMemberClick={handleMemberClick}
      />
    </div>
  );
};

export default Sidebar;
