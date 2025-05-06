import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const CraftingMenuContainer = styled.div`
  background-color: #f0e68c; /* Khaki */
  border: 1px solid #b8860b; /* Dark Goldenrod */
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 400px;
`;

const CraftingTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
`;

const RecipeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecipeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #d2b48c; /* Tan */

  &:last-child {
    border-bottom: none;
  }
`;

const RecipeName = styled.span`
  font-weight: bold;
`;

const RecipeIngredients = styled.div`
  font-size: 0.9em;
  color: #555;
`;

const CraftingButton = styled(Button)`
  margin-left: 10px;
`;

const CraftingMenu = ({ inventory, recipes, onCraft }) => {
  return (
    <CraftingMenuContainer>
      <CraftingTitle>Crafting</CraftingTitle>
      <RecipeList>
        {recipes.map((recipe) => {
          const canCraft = recipe.ingredients.every(
            (ingredient) => inventory[ingredient.item] >= ingredient.quantity
          );

          return (
            <RecipeItem key={recipe.id}>
              <div>
                <RecipeName>{recipe.name}</RecipeName>
                <RecipeIngredients>
                  Ingredients:
                  {recipe.ingredients.map((ing, index) => (
                    <span key={index}>
                      {ing.quantity} {ing.item}
                      {index < recipe.ingredients.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </RecipeIngredients>
              </div>
              <CraftingButton
                onClick={() => canCraft && onCraft(recipe.id)}
                variant={canCraft ? 'primary' : 'secondary'}
                disabled={!canCraft}
                size="small"
              >
                {canCraft ? 'Craft' : 'Missing Items'}
              </CraftingButton>
            </RecipeItem>
          );
        })}
      </RecipeList>
    </CraftingMenuContainer>
  );
};

export default CraftingMenu;