#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(ParOuImparTest, OutputTest)
{
    system("g++ -o aluno_parimpar aluno_parimpar.cpp");
    system("echo '7' | ./aluno_parimpar > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Ímpar");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
