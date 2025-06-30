import '../styles/sidebar.css';
import { useAppContext } from '../context/appContext.js';
import { useState } from 'react';
import ApiService from '../ApiService.js';

const Sidebar = () => {
    const { labels, setLabels, currentLabel, setCurrentLabel } = useAppContext();
    const [showLabelCreation, setShowLabelCreation] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');

    // Default labels for all users.
    const defaultLabels = [
        {"name" : "Inbox", "photo_asset" : "../../misc/inbox_icon.png"},
        {"name" : "Starred", "photo_asset" : "../../misc/star_icon.png"},
        {"name" : "Sent", "photo_asset" : "../../misc/send_icon.png"},
        {"name" : "Draft", "photo_asset" : "../../misc/draft_icon.png"},
        {"name" : "Spam", "photo_asset" : "../../misc/spam_icon.png"},
        {"name" : "Trash", "photo_asset" : "../../misc/delete_icon.png"}
    ];

    const deleteLabel = async (e, label) => {
        e.preventDefault();
        try {
            await ApiService.deleteLabel(label.id);
            let newLabels = await ApiService.getAllLabels();
            let defaultLabelNames = defaultLabels.map(l => l.name);
            let filteredLabels = newLabels.filter(label => !defaultLabelNames.includes(label.name));
            setLabels(filteredLabels);
        } catch (err) {
            console.log("Failed to delete label");
        }
    };

    const createLabel = async (labelName) => {
        try {
            let findDup = labels.find(label => label.name === labelName);
            // Prevent duplicate names in same user and empty labels.
            if (findDup === undefined && labelName !== "") {
                let res = await ApiService.createLabel({ name : labelName, color : "#FFFFFF" });
                let newLabels = [...labels, res.label];
                setLabels(newLabels);
            }
        } catch (err) {
            console.log("Failed to create label");
        }
    }

    return (
        <>
        <div className="sidebar">
            {showLabelCreation && (
            <div className="newlabel-overlay">
                <div className="newlabel">
                    <h3>New label</h3>
                    <input
                        type="text"
                        placeholder="Enter label name"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                    />
                    <div className="newlabel-buttons">
                        <button className='label-button' 
                        onClick={() => setShowLabelCreation(false)}>Cancel</button>
                        <button className='label-button' 
                        onClick={() => {
                            createLabel(newLabelName);
                            setShowLabelCreation(false);
                        }}>Create</button>
                    </div>
                </div>
            </div>
            )}
            {/* Add default labels and user specific labels */}
            {defaultLabels.map(label => {
                const labelName = typeof label === 'string' ? label : label.name;
                return (
                    <p
                    key={labelName}
                    className={`sidebar-item ${currentLabel === labelName ? 'sidebar-active-label' : ''}`}
                    onClick={() => setCurrentLabel(labelName)}
                    >
                        <img src={label.photo_asset} alt={label.name} />
                        {labelName}
                    </p>
                );
            })}
    
            <p className="sidebar-add-label-tab">
                <strong>Labels</strong>
                <button className="sidebar-add-label-btn" title='Add Label' onClick={() => setShowLabelCreation(true)}>
                    <img src="../../misc/plus_sign.png" alt="Add label" />
                </button>
            </p>
    
            {labels.map(label => {
                const labelName = typeof label === 'string' ? label : label.name;
                return (
                    <p
                    onContextMenu={(e) => deleteLabel(e, label)}
                    key={labelName}
                    className={`sidebar-item ${currentLabel === labelName ? 'sidebar-active-label' : ''}`}
                    onClick={() => setCurrentLabel(labelName)}
                    >
                        <img src="../../misc/def_label_icon.png" alt={label.name} />
                        {labelName}
                    </p>
                );
            })}
        </div>
        </>
    )
}

export default Sidebar;