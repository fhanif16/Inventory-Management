'use client'
import Image from "next/image";
import { useState , useEffect } from "react";
import { firestore } from "@/firrbase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc, 

  } from "firebase/firestore";


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  }
  
  export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [editItemName, setEditItemName] = useState('');
    const [editItemModalOpen, setEditItemModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
  
    const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
  
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
      console.log(inventoryList);
    }
  
    const addItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await updateInventory();
    }
  
    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    }
  
    const removeAllItems = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
      }
      await updateInventory();
    }
  
    const updateItem = async (oldItem, newItem) => {
      const oldDocRef = doc(collection(firestore, 'inventory'), oldItem);
      const newDocRef = doc(collection(firestore, 'inventory'), newItem);
      const oldDocSnap = await getDoc(oldDocRef);
      if (oldDocSnap.exists()) {
        const data = oldDocSnap.data();
        await setDoc(newDocRef, data);
        await deleteDoc(oldDocRef);
      }
      await updateInventory();
    }
  
    useEffect(() => {
      updateInventory();
    }, []);
  
    useEffect(() => {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInventory(filtered);
    }, [searchQuery, inventory]);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEditOpen = (item) => {
      setCurrentItem(item);
      setEditItemName(item.name);
      setEditItemModalOpen(true);
    }
    const handleEditClose = () => setEditItemModalOpen(false);
  
    return (
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        sx={{
          backgroundImage: `url('/pic.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Modal
          open={editItemModalOpen}
          onClose={handleEditClose}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box sx={style}>
            <Typography id="edit-modal-title" variant="h6" component="h2">
              Update Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="edit-outlined-basic"
                label="New Item Name"
                variant="outlined"
                fullWidth
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  updateItem(currentItem.name, editItemName);
                  setEditItemName('');
                  handleEditClose();
                }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Stack direction="row" spacing={3} alignItems="center" bgcolor={'#ADD8E6'}>
          <Button variant="contained" onClick={handleOpen} >
            Add New Item
          </Button>
          <TextField
          bgcolor={'#ADD8E6'}
            id="search-basic"
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Stack>
        <Box border={'5px solid #333'} marginTop={2} bgcolor={'#ADD8E6'}>
          <Box
            width="1000px"
            height="150px"
            bgcolor={'#ADD8E6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="1000px" height="400px" spacing={2} overflow={'auto'}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Box marginX={1}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                </Box>
                <Box marginX={1}>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Delete
                  </Button>
                </Box>
                <Box marginX={1}>
                  <Button variant="contained" onClick={() => handleEditOpen({ name, quantity })}>
                    Update
                  </Button>
                </Box>
                <Box marginX={1}>
                  <Button variant="contained" onClick={() => removeAllItems(name)}>
                    Remove All
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    );
  }