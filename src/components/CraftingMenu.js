import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

// Styled Components
const CraftingMenuContainer = styled.div`
  background-color: #f0e68c; /* Khaki */
  border: 1px solid #b8860b; /* Dark Goldenrod */
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 400px;
  font-family: 'Arial', sans-serif;
`;

const CraftingTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
  color: #8B4513;
`;

const RecipeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecipeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #d2b48c; /* Tan */

  &:last-child {
    border-bottom: none;
  }
`;

const RecipeName = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  color: #333;
`;

const IngredientList = styled.div`
  font-size: 0.9em;
  color: #555;
`;

const Ingredient = styled.span`
  color: ${props => (props.hasEnough ? '#2e8b57' : '#dc3545')};
  font-weight: ${props => (props.hasEnough ? 'normal' : 'bold')};
`;

const CraftingButton = styled(Button)`
  margin-left: 10px;
  flex-shrink: 0; /* Prevents button from shrinking */
`;

// Main Component
const CraftingMenu = ({ inventory, recipes, onCraft }) => {
  const [isCrafting, setIsCrafting] = useState(false);

  const handleCraft = (recipeId) => {
    setIsCrafting(true);
    // Simulating a delay for the crafting process
    setTimeout(() => {
      onCraft(recipeId);
      setIsCrafting(false);
    }, 500);
  };

  return (
    <CraftingMenuContainer>
      <CraftingTitle>Crafting</CraftingTitle>
      {recipes.length > 0 ? (
        <RecipeList>
          {recipes.map((recipe) => {
            const canCraft = recipe.ingredients.every(
              (ingredient) => inventory[ingredient.item] >= ingredient.quantity
            );

            return (
              <RecipeItem key={recipe.id}>
                <div>
                  <RecipeName>{recipe.name}</RecipeName>
                  <IngredientList>
                    Ingredients:
                    {recipe.ingredients.map((ing, index) => {
                      const hasEnough = inventory[ing.item] >= ing.quantity;
                      const currentCount = inventory[ing.item] || 0;
                      return (
                        <Ingredient key={index} hasEnough={hasEnough}>
                          {' '} {ing.quantity} {ing.item} ({currentCount}/{ing.quantity})
                          {index < recipe.ingredients.length - 1 ? ', ' : ''}
                        </Ingredient>
                      );
                    })}
                  </IngredientList>
                </div>
                <CraftingButton
                  onClick={() => handleCraft(recipe.id)}
                  variant={canCraft ? 'primary' : 'disabled'}
                  disabled={!canCraft || isCrafting}
                  size="small"
                >
                  {isCrafting ? 'Crafting...' : (canCraft ? 'Craft' : 'Missing Items')}
                </CraftingButton>
              </RecipeItem>
            );
          })}
        </RecipeList>
      ) : (
        <p style={{ textAlign: 'center', color: '#555' }}>No recipes available.</p>
      )}
    </CraftingMenuContainer>
  );
};

export default CraftingMenu;