import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

export default function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await API.get("/sessions");
            setSessions(res.data.sessions);
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        } finally {
            setLoading(false);
        }
    };

    const map = new Map();
    for (const session of sessions) {
        map.set(session._id, session);
    }
    const uniqueSessions = Array.from(map.values());

    const logout = async () => {
        try {
            const response = await API.post("/logout");
            navigate("/login");
            console.log(response.data.message);
        } catch (err) {
            console.error(err);
            console.log("Logout failed. Please try again.");
        }
    };
    const about = () => {
        navigate("/about");
    }
    const dashboard = () => {
        navigate("/dashboard");
    }

    const logoutSession = async (sessionId) => {
        try {
            await API.delete(`/sessions/${sessionId}`);
            setSessions(prev => prev.filter(s => s._id !== sessionId))
        } catch (err) {
            console.error("Failed to logout session", err);
        }
    }

    if (loading) {
        return (
            <div className="dashboard-content">
                <h2>Active Sessions</h2>
                <p>Loading sessions...</p>
            </div>
        );
    }

    return (
        <>
            <div className="navbar">
                <h2>Sessions</h2>
                <div>
                    <button onClick={dashboard}>Dashboard</button>
                    <button onClick={about}>About</button>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            <div className="content">
                <div className="sessions-header">
                    <h2>Active Sessions</h2>
                    <button className="logout-all-btn">Logout All</button>
                </div>
                <div className="sessions-grid">
                    {uniqueSessions.map((session) => (
                        <div key={session._id} className="session-card">
                            <div className="session-info">
                                <h3>
                                    {session.deviceInfo?.deviceType || "Unknown Device"}
                                </h3>
                                <p><strong>Browser:</strong> {session.deviceInfo?.userAgent || "Unknown"}</p>
                                <p><strong>IP:</strong> {session.deviceInfo?.ipAddress || "Unknown"}</p>
                                <p>
                                    <strong>Last Used:</strong>{" "}
                                    {session.deviceInfo?.lastUsed ? new Date(session.deviceInfo.lastUsed).toLocaleString() : "N/A"}
                                </p>
                                <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(session.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {}
                            <div className="session-actions">
                                {!session.current && (<button onClick={() => logoutSession(session._id)}>Logout</button>)}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
