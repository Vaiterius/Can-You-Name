import Category from "../SearchCategory";

function CategoryButton({ value }: { value: Category }) {
    return <button className="btn">{value}</button>
}

export default CategoryButton;