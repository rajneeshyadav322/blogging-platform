import {DocumentData, getDocs} from 'firebase/firestore'

export const getAllDocuments = async (collectionRef:any) => {
    const data = await getDocs(collectionRef)
    return data.docs.map((item:DocumentData) => ({...item.data(), id: item.id}))
}