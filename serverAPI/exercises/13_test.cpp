#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(InversaoVetorTest, OutputTest)
{
    system("g++ -o aluno_inversao aluno_inversao.cpp");
    system("echo '1 2 3 4 5' | ./aluno_inversao > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "5 4 3 2 1");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
