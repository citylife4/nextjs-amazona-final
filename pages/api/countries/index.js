export default function (req, res) {
  setTimeout(() => {
    return res.send([
      { label: 'Canada', name: 'Canada' },
      { label: 'India', name: 'India' },
      { label: 'USA', name: 'USA' },
    ]);
  }, 2000);
}
