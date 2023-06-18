export const Card = ({ title, className="", children }) => (
    <div className={`card bg-base-300 ${className}`}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
      </div>
    </div>
);