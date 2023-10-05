import { useEffect, useState } from "react";
import { Characteristic, IProduct } from "./product-types";
import CharacteristicsMapper from "./characteristics-mapper";
import productService, { newProductRequestData } from "./product-service";

const NewProductPage = () => {
    const [avatar, setAvatar] = useState<File | undefined>();
    const [imgURL, setImgURL] = useState<string>(process.env.REACT_APP_IMAGE_PLACEHOLDER!);

    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
    
    const defaultCharacteristic = {key: "", value: ""}
    const [currentCharacteristic, setCurrentCharacteristic] = useState<Characteristic>(defaultCharacteristic);

    useEffect(() => {
        if(avatar) setImgURL(URL.createObjectURL(avatar));
        else setImgURL(process.env.REACT_APP_IMAGE_PLACEHOLDER!);
    }, [avatar])

    const characteristicValidation = () => 
        currentCharacteristic.value.length > 0 && 
        currentCharacteristic.key.length > 0
    
    const handleCharacteristicLabel = (newKey: string) => {
        if(currentCharacteristic) {
            const newCharacteristic = {
                key: newKey,
                value: currentCharacteristic?.value
            };
            setCurrentCharacteristic(newCharacteristic);
        }
    }

    const handleCharacteristicValue = (newValue: string) => {
        if(currentCharacteristic) {
            const newCharacteristic = {
                key: currentCharacteristic?.key,
                value: newValue
            };
            setCurrentCharacteristic(newCharacteristic);
        }
    }

    const handleCharacteristicPush = () => {
        characteristicValidation();
        setCharacteristics([...characteristics, currentCharacteristic]);
        setCurrentCharacteristic({key: "", value: ""});
    }

    const handleNewImage = (files: FileList | null) => {
        if (!files) return;
            const file: File = files[0];
            if (!file) return;
            setAvatar(file);
    }

    const dropImage = () => {
        setAvatar(undefined);
    }

    const handleSubmit = async () => {
        const newProduct: IProduct = {
            name,
            description,
            category,
            price,
            characteristics
        }
        await productService.newProduct(newProduct, avatar!);
    }

    return <>
        <div>
            <form>
                <div>
                    <div>
                        <img src={imgURL}/>
                    </div>
                    <label>Зображення продукту:</label>
                    <input
                        type="file"
                        onChange={(e) => handleNewImage(e.target.files)}
                    />
                    <button type="button" onClick={dropImage}>Прибрати зображення</button>
                </div>
                <div>
                    <label>Категорія:</label>
                    <input type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}></input>
                </div>
                <div>
                    <label>Назва:</label>
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div>
                    <label>Опис:</label>
                    <input type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}></input>
                </div>
                <div>
                    <label>Ціна:</label>
                    <input type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}></input>
                </div>
                <div>
                    <div>Характеристики:</div>
                    <div>
                        <label>Ключ</label>
                        <input type="text" value={currentCharacteristic?.key} onChange={
                            (e) => handleCharacteristicLabel(e.target.value)
                        }/>
                        <label>Значення</label>
                        <input type="text" value={currentCharacteristic?.value} onChange={
                            (e) => handleCharacteristicValue(e.target.value)
                        }/>
                        <button type="button" onClick={handleCharacteristicPush}>додати</button>
                    </div>
                    <CharacteristicsMapper characteristics={characteristics} onRemove={(newValue: Characteristic[]) => {
                        setCharacteristics([...newValue]);
                    }}/>
                </div>
                <button type="button" onClick={handleSubmit}>Створити товар</button>
            </form>
        </div>
    </>
}

export default NewProductPage;