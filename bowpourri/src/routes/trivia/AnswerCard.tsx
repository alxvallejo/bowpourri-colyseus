type AnswerCardProps = {
    answer: string;
    selectedOption: string;
};

export default function AnswerCard({
    answer,
    selectedOption,
}: AnswerCardProps) {
    if (answer === selectedOption) {
        return (
            <div className='bg-green-200 p-4 rounded-lg'>
                <p className='text-lg font-bold'>Correct!</p>
                <p className='text-sm'>You selected: {selectedOption}</p>
            </div>
        );
    } else {
        return (
            <div className='bg-red-200 p-4 rounded-lg'>
                <p className='text-lg font-bold'>Incorrect!</p>
                <p className='text-sm'>You selected: {selectedOption}</p>
                <p className='text-sm'>Correct answer: {answer}</p>
            </div>
        );
    }
}
