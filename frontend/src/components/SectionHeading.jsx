import PropTypes from 'prop-types';

export function SectionHeading({ children }) {
  return (
    <h2 className="agenda__heading">
      <span className="agenda__heading-tag">{children}</span>
    </h2>
  );
}

SectionHeading.propTypes = {
  children: PropTypes.node.isRequired,
};
