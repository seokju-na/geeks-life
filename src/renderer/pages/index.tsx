import { styled } from '~/renderer/css';

export default function IndexPage() {
  return (
    <>
      Hello World!
      <div>
        <Button>Hi</Button>
      </div>
    </>
  );
}

const Button = styled('button', {
  height: 56,
});
