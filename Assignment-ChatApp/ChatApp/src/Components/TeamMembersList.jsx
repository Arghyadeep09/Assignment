/* eslint-disable react/prop-types */
const TeamMembersList = ({
  loading,
  error,
  teamMembers,
  handleMemberClick,
}) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (teamMembers.length === 0) {
    return <p>No team members found</p>;
  }

  return (
    <div className="team-members">
      {teamMembers.map((member) => (
        <div
          key={member.uid}
          className="team-member"
          onClick={() => handleMemberClick(member)}
        >
          <img src={member.avatar} alt={member.name} className="avatar" />
          <div>
            <p>{member.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
