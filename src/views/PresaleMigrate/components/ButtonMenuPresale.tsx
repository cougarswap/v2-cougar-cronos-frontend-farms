import React, { cloneElement, Children, ReactElement } from "react";
import styled, { DefaultTheme } from "styled-components";
import { ButtonMenuItemProps, ButtonMenuProps } from "@pancakeswap-libs/uikit";


type StyledButtonMenuProps = {
    theme: DefaultTheme;
  };
  
const StyledButtonMenu = styled.div`
  border-radius: 16px;
  display: inline-flex;

  & > button + button,
  & > a + a {
    margin-left: 2px; // To avoid focus shadow overlap
  }
`;

const ButtonMenuPresale: React.FC<ButtonMenuProps> = ({
  activeIndex = 0,
  onClick,
  children,
}) => {
  return (
    <StyledButtonMenu>
      {Children.map(children, (child: ReactElement<ButtonMenuItemProps>, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onClick ? () => onClick(index) : undefined,
        });
      })}
    </StyledButtonMenu>
  );
};

export default ButtonMenuPresale;
