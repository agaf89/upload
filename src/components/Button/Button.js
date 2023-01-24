import classNames from "classnames";
import styles from "./styles.module.scss";

export const Button = ({ theme = "default", children, ...props }) => {
  const cn = classNames(styles.button, styles[theme]);

  return (
    <button className={cn} {...props}>
      {children}
    </button>
  );
};
