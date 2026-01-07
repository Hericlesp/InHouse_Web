import './StatsCard.css';

const StatsCard = ({ icon, value, label, trend, color = 'pink' }) => {
    return (
        <div className={`stats-card stats-card-${color}`}>
            <div className="stats-icon">{icon}</div>
            <div className="stats-content">
                <div className="stats-value">{value}</div>
                <div className="stats-label">{label}</div>
                {trend && (
                    <div className={`stats-trend ${trend.direction}`}>
                        {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
