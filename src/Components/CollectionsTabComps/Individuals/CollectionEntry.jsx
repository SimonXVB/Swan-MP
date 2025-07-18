import { useContext, useEffect, useRef, useState } from "react";
import { mainContext } from "../../../Context/context";
import { ContextMenu } from "../../ContextMenu";
import { DeleteCollectionModal } from "./DeleteCollectionModal";

export function CollectionEntry({collectionName, img, getCollection, contextMenu, setContextMenu}) {
    const { tabInfo, setTabInfo } = useContext(mainContext);

    const inputRef = useRef();

    const [name, setName] = useState(collectionName);
    const [deleteModal, setDeleteModal] = useState(false);
    const [coords, setCoords] = useState({});

    const contextMenuEntries = [
        {
            text: "Open",
            action: () => openCollection()
        },
        {
            text: "Change Cover Image",
            action: () => editCoverImage()
        },
        {
            text: "Rename",
            action: () => enableRename()
        },
        {
            text: "Delete",
            action: () => openDeleteModal()
        }
    ];

    function setContextData(e) {
        setCoords({x: e.clientX, y: e.clientY});
        setContextMenu(collectionName);
    };

    function openCollection() {
        setTabInfo(prev => ({
            ...prev,
            currentCollection: collectionName
        }));
    };

    async function editCoverImage() {
        setContextMenu("");

        await window.collection.editCover({
            name: collectionName,
            targetDir: tabInfo.currentTab
        });

        await getCollection();
    };

    function enableRename() {
        document.body.removeEventListener("click", renameCollection);
        document.body.removeEventListener("keyup", renameCollection);

        inputRef.current.disabled = false;
        inputRef.current.select();

        setContextMenu("");

        setTimeout(() => {
            document.body.addEventListener("click", renameCollection);
            document.body.addEventListener("keyup", renameCollection);
        }, 0);
    };

    async function renameCollection(e) {
        // Checks if input field exists/is focused or Enter/Esc key is pressed and returns function early
        if(!inputRef.current) return;
        if(!e.key && e.target === inputRef.current) return;
        if(e.key && (e.key !== "Enter" && e.key !== "Escape")) return;

        const res = await window.collection.editName({
            oldName: collectionName,
            newName: inputRef.current.value,
            targetDir: tabInfo.currentTab
        });

        if(res === "edited") {
            await getCollection();
        } else {
            setName(collectionName);
            inputRef.current.disabled = true;
        };

        document.body.removeEventListener("click", renameCollection);
        document.body.removeEventListener("keyup", renameCollection);
    };

    function openDeleteModal() {
        setDeleteModal(true);
        setContextMenu("");
    };

    async function deleteCollection() {
        const res = await window.collection.deleteCollection({
            name: name, 
            targetDir: tabInfo.currentTab
        });

        if(res === "deleted") {
            await getCollection();
        };
    };

    useEffect(() => {
        return () => {
            document.body.removeEventListener("click", renameCollection);
            document.body.removeEventListener("keyup", renameCollection);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div onContextMenu={e => setContextData(e)} className="relative w-50 h-50 flex flex-col justify-center items-center bg-red-400">
                <img src={img && `${img}?${Date.now()}`}/>
                <input ref={inputRef} onChange={e => setName(e.target.value)} className="absolute bottom-0 left-0 w-full bg-white/70 font-bold backdrop-blur-xl px-1 overflow-hidden outline-0" disabled value={name}/>
            </div>
            {deleteModal && <DeleteCollectionModal 
                setDeleteModal={setDeleteModal}
                deleteCollection={deleteCollection}
            />}
            {contextMenu === collectionName && <ContextMenu
                setContextMenu={setContextMenu}
                entries={contextMenuEntries}
                coords={coords}
            />}
        </>
    )
};