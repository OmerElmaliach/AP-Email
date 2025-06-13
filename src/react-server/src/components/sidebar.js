import '../styles/sidebar.css';

const Sidebar = ({ currentLabel, handleLabelClick, labels }) => {
    // Default labels for all users.
    const defaultLabels = [
        {"name" : "Inbox", "photo_asset" : "misc/inbox_icon.png"},
        {"name" : "Starred", "photo_asset" : "misc/star_icon.png"},
        {"name" : "Sent", "photo_asset" : "misc/send_icon.png"},
        {"name" : "Draft", "photo_asset" : "misc/draft_icon.png"},
        {"name" : "Spam", "photo_asset" : "misc/spam_icon.png"},
        {"name" : "Trash", "photo_asset" : "misc/delete_icon.png"}
    ];

    return (
        <>
        <div className="sidebar">
            {/* Add default labels and user specific labels */}
            {defaultLabels.map(label => {
                const labelName = typeof label === 'string' ? label : label.name;
                return (
                    <p
                    key={labelName}
                    className={`sidebar-item ${currentLabel === labelName ? 'sidebar-active-label' : ''}`}
                    onClick={() => handleLabelClick(labelName)}
                    >
                        <img src={label.photo_asset} alt={label.name} />
                        {labelName}
                    </p>
                );
            })}
    
            <p className="sidebar-add-label-tab">
                <strong>Labels</strong>
                <button className="sidebar-add-label-btn">
                    <img src="misc/plus_sign.png" alt="Add label" />
                </button>
            </p>
    
            {labels.map(label => {
                const labelName = typeof label === 'string' ? label : label.name;
                return (
                    <p
                    key={labelName}
                    className={`sidebar-item ${currentLabel === labelName ? 'sidebar-active-label' : ''}`}
                    onClick={() => handleLabelClick(labelName)}
                    >
                        <img src="misc/def_label_icon.png" alt={label.name} />
                        {labelName}
                    </p>
                );
            })}
        </div>
        </>
    )
}

export default Sidebar;