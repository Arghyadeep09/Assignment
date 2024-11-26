import {  useNavigate ,Outlet } from "react-router-dom";
const Home = () => { 
  const navigate = useNavigate();
  const handleGetStarted = () => navigate("/login")
  
  return ( 
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '50px',
      }}
    >
    <div style={{ maxWidth: '50%' }}>
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Have your best chat
      </h1>
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: '300',
          marginBottom: '30px',
        }}
      >
        Fast, easy & unlimited team chat.
      </h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
              className="get-started"
              onClick={  handleGetStarted } 
              style={{
                fontSize: '1.2rem',
                padding: '10px 20px',
                backgroundColor: '#fff',
                color: '#007bff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Image Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: "end",
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src="https://www.shutterstock.com/image-photo/young-happy-smiling-pretty-woman-260nw-2249452187.jpg"
              alt="User 1"
              style={{
                width: '90%',
                maxWidth: '380px',
                maxHeight: '250px',
                borderRadius: '10px',
                marginRight: "180px",
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '160px',
                left: '150px',
                backgroundColor: '#ffa500',
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              Hi, how&apos;s the report?
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img
              src="https://www.qrcaviews.org/wp-content/uploads/2020/03/phone-girl-FI-spring20.jpg"
              alt="User 2"
              style={{ width: '200px', height: '200px', borderRadius: '10px' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '120px',
                backgroundColor: '#007bff',
                padding: '10px',
                borderRadius: '10px',
                color: '#fff',
              }}
            >
              I&rsquo;m on it!
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div> 
  );
};

export default Home;
