import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInterface {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<FoodInterface[]>();
  const [editingFood, setEditingFood] = useState();
  const [modalOpen, setModalOpen] = useState();
  const [editModalOpen, setEditModalOpen] = useState();

  useEffect(() => {
    async function loadFoods() {
      const { data: response } = await api.get<FoodInterface[]>('/foods');

      setFoods(response);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: FoodInterface) {
    try {
      const { data: response } = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([ foods, response ]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodInterface) {
    try {
      const { data: foodUpdated } = await api.put(`/foods/${editingFood.id}`, { 
        ...editingFood, 
        ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  handleDeleteFood = async id => {
    const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    this.setState({ foods: foodsFiltered });
  }

  toggleModal = () => {
    const { modalOpen } = this.state;

    this.setState({ modalOpen: !modalOpen });
  }

  toggleEditModal = () => {
    const { editModalOpen } = this.state;

    this.setState({ editModalOpen: !editModalOpen });
  }

  handleEditFood = food => {
    this.setState({ editingFood: food, editModalOpen: true });
  }

  render() {
    const { modalOpen, editModalOpen, editingFood, foods } = this.state;

    return (
      <>
        <Header openModal={this.toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={this.toggleModal}
          handleAddFood={this.handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={this.toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={this.handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={this.handleDeleteFood}
                handleEditFood={this.handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }
};

export default Dashboard;
